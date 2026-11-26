import { AuthGate } from "@/components/auth/auth-gate/AuthGate";
import { ConversationList } from "@/components/chat/conversation-list/ConversationList";

export default function ConversationsListPage() {
  return (
    <AuthGate message="Zaloguj się, aby zobaczyć wiadomości.">
      <ConversationList />
    </AuthGate>
  );
}
