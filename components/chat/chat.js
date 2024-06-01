import ChatTopbar from "./chat-topbar"
import { ChatList } from "./chat-list"
import React from "react"

export function Chat({ messages, selectedUser, isMobile }) {
  const [messagesState, setMessages] = React.useState(messages ?? [])

  const sendMessage = (newMessage) => {
    setMessages([...messagesState, newMessage])
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
