"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CommandList } from "cmdk"
import { useProjectContext } from "../context/project"
import { useUserContext } from "../context/user"
import { USERS } from "@/constants/enum"

export function UserCombobox({ userId, onSelect, onlyEmployee }) {


  const [temporerEmployee,setTemporerEmployee] = React.useState()

  const { data ,triggerRefetch} = useUserContext()
  const [open, setOpen] = React.useState(false)

  const user = data.find((user) => user.uid === userId)

  const temporerOne= data.find((user) => user.uid === temporerEmployee)

  console.log(temporerOne,"temporer")

  const finalData = onlyEmployee
    ? data.filter((user) => user.role === USERS.EMPLOYEE)
    : data

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {user &&  temporerOne?.email ? temporerOne?.email : user.email}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search emploee..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {finalData.map((user) => (
                <CommandItem
                  key={user.uid}
                  value={user.uid}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === userId ? "" : currentValue)
                    setOpen(false)
                    setTemporerEmployee(currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      userId === user.uid ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.email}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
