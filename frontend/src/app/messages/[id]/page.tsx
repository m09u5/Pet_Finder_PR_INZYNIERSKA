import { AuthGate } from "@/components/auth/auth-gate/AuthGate";
import { ConversationThread } from "@/components/chat/conversation-thread/ConversationThread";

export default async function ConversationThreadPage({ params }: PageProps<"/messages/[id]">) {
  const { id } = await params;

  return (
    <AuthGate message="Zaloguj się, aby zobaczyć wiadomości.">
      <ConversationThread conversationId={id} />
    </AuthGate>
  );
}
