import { atom, useAtom } from "jotai"

import { Mail, mails } from "@/components/mail/_data"

const configAtom = atom({
  selected: mails[0].id,
})

export function useMail() {
  return useAtom(configAtom)
}
