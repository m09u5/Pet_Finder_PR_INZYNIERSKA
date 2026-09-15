import type { IncomingMessage, Server } from "node:http";
import type { PublicMessage } from "@pet-finder/shared";
import { WebSocket, WebSocketServer } from "ws";
import { verifyAccessToken } from "../utils/jwt";

const connectionsByUserId = new Map<string, Set<WebSocket>>();

function parseAccessTokenFromCookies(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) continue;
    const name = part.slice(0, separatorIndex).trim();
    if (name === "access_token") {
      return decodeURIComponent(part.slice(separatorIndex + 1).trim());
    }
  }
  return undefined;
}

export function setupChatWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/chat" });

  wss.on("connection", (socket: WebSocket, request: IncomingMessage) => {
    const token = parseAccessTokenFromCookies(request.headers.cookie);
    if (!token) {
      socket.close(4001, "Brak autoryzacji");
      return;
    }

    let userId: string;
    try {
      userId = verifyAccessToken(token).sub;
    } catch {
      socket.close(4001, "Nieprawidłowy token");
      return;
    }

    if (!connectionsByUserId.has(userId)) {
      connectionsByUserId.set(userId, new Set());
    }
    connectionsByUserId.get(userId)!.add(socket);

    socket.on("close", () => {
      const sockets = connectionsByUserId.get(userId);
      sockets?.delete(socket);
      if (sockets && sockets.size === 0) {
        connectionsByUserId.delete(userId);
      }
    });
  });

  return wss;
}

export function pushMessageToUsers(userIds: string[], message: PublicMessage) {
  const payload = JSON.stringify({ type: "message", message });
  for (const userId of userIds) {
    const sockets = connectionsByUserId.get(userId);
    if (!sockets) continue;
    for (const socket of sockets) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    }
  }
}
