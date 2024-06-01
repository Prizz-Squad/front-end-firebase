import { accounts, mails } from "@/components/mail/_data"
import { Mail } from "@/components/mail/mail"
import React from "react"

export default function MailPage() {
  // const layout = cookies().get("react-resizable-panels:layout")
  // const collapsed = cookies().get("react-resizable-panels:collapsed")

  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
  return (
    <Mail
      accounts={accounts}
      mails={mails}
      // defaultLayout={defaultLayout}
      // defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
    />
  )
}
