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
import { useRouter } from "next/router"

export function DepsMultiPicker({ saveToUrl = true }) {
  const router = useRouter()
  const [checkedDeps, setCheckedDeps] = React.useState([])

  const ITEMS = Object.keys(DEPARTMENTS).map((key) => ({
    label: DEPARTMENTS[key],
    checked: checkedDeps.includes(DEPARTMENTS[key]),
    onCheckedChange: (checked) => {
      const newCheckedDeps = [...checkedDeps]
      checked
        ? newCheckedDeps.push(DEPARTMENTS[key])
        : newCheckedDeps.splice(newCheckedDeps.indexOf(DEPARTMENTS[key]), 1)
      setCheckedDeps(newCheckedDeps)

      if (!saveToUrl) return

      const deps = newCheckedDeps.join(",")
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      params.set("deps", deps)
      router.push(`${url.pathname}?${params.toString()}`)
    },
  }))

  React.useEffect(() => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    const deps = params.get("deps")
    if (!deps) return

    setCheckedDeps(deps.split(","))
  }, [])

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
