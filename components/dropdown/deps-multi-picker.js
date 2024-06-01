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

export function DepsMultiPicker() {
  const [showStatusBar, setShowStatusBar] = React.useState(true)
  const [showActivityBar, setShowActivityBar] = React.useState(false)
  const [showPanel, setShowPanel] = React.useState(false)

  const ITEMS = [
    {
      label: "Status Bar",
      checked: showStatusBar,
      onCheckedChange: setShowStatusBar,
    },
    {
      label: "Activity Bar",
      checked: showActivityBar,
      onCheckedChange: setShowActivityBar,
      disabled: true,
    },
    {
      label: "Panel",
      checked: showPanel,
      onCheckedChange: setShowPanel,
    },
  ]

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
