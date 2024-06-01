import ChatTopbar from "./chat-topbar"
import { ChatList } from "./chat-list"
import React from "react"
import { createMessage } from "@/db/collections/messages"
import { useUserContext } from "../context/user"

export function Chat({ messages, selectedUser, isMobile }) {
  console.log("messages", messages)
  const { userId } = useUserContext()
  const [messagesState, setMessages] = React.useState(messages ?? [])

  const sendMessage = (newMessage) => {
    setMessages([...messagesState, newMessage])
    createMessage({
      text: newMessage.message,
      userId,
      toUserId: selectedUser.uid,
    })
  }

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  )
}
