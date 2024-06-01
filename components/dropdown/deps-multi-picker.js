"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { Badge } from "../ui/badge"
import { DEPARTMENTS } from "@/constants/enum"

export function DepsMultiPicker() {
  const [checkedDeps, setCheckedDeps] = React.useState([])

  const ITEMS = Object.keys(DEPARTMENTS).map((key) => ({
    label: DEPARTMENTS[key],
    checked: checkedDeps.includes(DEPARTMENTS[key]),
    onCheckedChange: (checked) => {
      if (checked) {
        setCheckedDeps((prev) => [...prev, DEPARTMENTS[key]])
      } else {
        setCheckedDeps((prev) => prev.filter((dep) => dep !== DEPARTMENTS[key]))
      }
    },
  }))

  const atLeastOneChecked = ITEMS.some((item) => item.checked)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Departments
          {atLeastOneChecked && (
            <Badge variant="solid">
              {ITEMS.filter((item) => item.checked).length}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Departments</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ITEMS.map((item, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            disabled={item.disabled}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
