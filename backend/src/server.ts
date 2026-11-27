import { createServer } from "node:http";
import { createApp } from "./app";
import { env } from "./config/env";
import { startReservationExpiryJob } from "./jobs/reservationExpiry.job";
import { setupChatWebSocket } from "./websocket/chat.ws";

const app = createApp();
const server = createServer(app);
setupChatWebSocket(server);
startReservationExpiryJob();

server.listen(env.PORT, () => {
  console.log(`api aplikacji dziala na http://localhost:${env.PORT}`);
});
