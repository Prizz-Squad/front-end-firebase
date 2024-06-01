import { userData } from "./_data"
import React, { useEffect, useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { Chat } from "./chat"
import { useUserContext } from "../context/user"
import { getMessagesSnapshot } from "@/db/collections/messages"

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [selectedUser, setSelectedUser] = React.useState(userData[0])
  const [isMobile, setIsMobile] = useState(false)
  const { data, userId } = useUserContext()
  const [messages, setMessages] = React.useState([])

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkScreenWidth()

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth)
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    getMessagesSnapshot(
      (messages) => {
        console.log("messages", messages)
        setMessages(messages)
      },
      {
        userId,
      }
    )
  }, [userId])

  useEffect(() => {
    // select the first user by default
    const user = data[0]
    setSelectedUser({
      ...user,
      messages: user?.messages ?? [],
      name: user?.firstName,
    })
  }, [data])

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true)
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`
        }}
        onExpand={() => {
          setIsCollapsed(false)
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`
        }}
        className={cn(
          isCollapsed &&
            "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          links={data.map((user) => ({
            ...user,
            name: user.firstName,
            messages: messages.map((message) => ({
              ...message,
              name: user.firstName,
              avatar: user.avatar,
            })),
            avatar: user.avatar,
            variant: selectedUser.name === user.name ? "grey" : "ghost",
          }))}
          isMobile={isMobile}
          onClick={(user) => {
            setSelectedUser(user)
          }}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <Chat
          // messages={selectedUser.messages}
          messages={messages.map((message) => ({
            ...message,
            name: selectedUser.name,
            avatar: selectedUser.avatar,
          }))}
          selectedUser={selectedUser}
          isMobile={isMobile}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
