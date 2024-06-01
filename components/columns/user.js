import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { DataTableColumnHeader } from "../data-table/col-header"
import { Checkbox } from "../ui/checkbox"
import { ProjectsListRowActions } from "../row-actions.js/projects-list"
import { UsersListRowActions } from "../row-actions.js/users-list"

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="First name" />
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Last name" />
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Role" />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return <UsersListRowActions row={row} />
    },
  },
]
