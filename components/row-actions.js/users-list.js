"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

import { labels } from "@/constants/list"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import { Loader2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { deleteProject, updateProject } from "@/db/collections/project"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProjectSchema } from "@/pages/projects"
import { useProjectContext } from "../context/project"
import { deleteUser, updateUser, updateUserStatus } from "@/db/collections/user"
import { useUserContext } from "../context/user"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export function UsersListRowActions({ row }) {
  const [role, setRole] = useState()
  const data = row.original
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [isLoading, setIsLoading] = useState()
  const { triggerRefetch } = useUserContext()

  const form = useForm({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      role: "",
    },
  })

  const onSubmit = async (values) => {
    const { uid } = data

    try {
      setIsLoading(true)
      await updateUserStatus(uid, role)
      toast("Project updated.")
      setShowUpdateDialog(false)
      setIsLoading(false)
      triggerRefetch()
    } catch (error) {
      console.log(error)
      toast.error("Project updated.")
    } finally {
      setIsLoading(false)
    }
  }

  console.log(role, "role")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(data.id)
              toast("Project ID copied.")
            }}
          >
            Copy User ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              //TODO: set state to show update dialog
              setShowUpdateDialog(true)
              form.setValue("name", data.name)
              form.setValue("description", data.description)
            }}
          >
            Change type
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              project and remove its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              variant="destructive"
              onClick={async () => {
                setIsLoading(true)
                const { uid } = data
                await deleteUser(uid)
                form.reset()
                triggerRefetch()
                setShowDeleteDialog(false)
                setIsLoading(false)
                toast("Project deleted.")
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete user
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Update the status</DialogTitle>
                <DialogDescription>
                  Fill in the form below to update the status of user.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Select className="w-full" onValueChange={setRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={data.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Role</SelectLabel>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={onSubmit} disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
