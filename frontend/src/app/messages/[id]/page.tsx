import { ConversationThreadClient } from "./ConversationThreadClient";

export default async function ConversationThreadPage({ params }: PageProps<"/messages/[id]">) {
  const { id } = await params;
  return <ConversationThreadClient id={id} />;
}
