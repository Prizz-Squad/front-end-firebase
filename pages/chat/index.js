import { ChatLayout } from "@/components/chat/chat-layout"

export default function ChatPage() {
  return (
    <main className="flex h-[calc(100dvh-4rem)] flex-col gap-4">
      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
        <ChatLayout navCollapsedSize={8} />
      </div>
    </main>
  )
}
