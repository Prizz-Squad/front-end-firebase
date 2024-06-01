import { useNotificationContext } from "@/components/context/notifications"
import { accounts, mails } from "@/components/mail/_data"
import { Mail } from "@/components/mail/mail"
import React from "react"

export default function MailPage() {
  // const layout = cookies().get("react-resizable-panels:layout")
  // const collapsed = cookies().get("react-resizable-panels:collapsed")

  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  const { data } = useNotificationContext()
  console.log("data", data)

  const mappedMails = data.map((item) => ({
    ...item,
    date: item?.createdAt?.toDate() || Timestamp.now().toDate(),
  }))

  return (
    <Mail
      mails={mappedMails}
      accounts={accounts}
      // mails={mails}
      // defaultLayout={defaultLayout}
      // defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
    />
  )
}
