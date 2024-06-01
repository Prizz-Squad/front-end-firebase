import { ChatLayout } from "@/components/chat/chat-layout"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function ChatPage() {
  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-32 gap-4">
      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
        <ChatLayout navCollapsedSize={8} />
      </div>
    </main>
  )
}
