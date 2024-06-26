import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cva } from "class-variance-authority"
import { Ellipsis, GripVertical } from "lucide-react"
import { Badge } from "../ui/badge"
import { ColumnId } from "./KanbanBoard"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { useState } from "react"
import { labels } from "@/constants/list"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "../ui/avatar"
import { useUserContext } from "../context/user"

export function TaskCard({ task, isOverlay, onClick }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    attributes: {
      roleDescription: "Task",
    },
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { user, data } = useUserContext()

  const userName = data.find((element) => element.uid === task.assignee)

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  })

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}
        onClick={onClick}
      >
        <CardHeader className="px-3 py-3 space-between items-center flex flex-row border-b-2 border-secondary relative">
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move task</span>
            <GripVertical />
          </Button>
          {task.name}
          <Badge variant={"outline"} className="ml-auto font-semibold">
            {task.department}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger className="ms-2">
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onClick={(e) => e.stopPropagation()}
              align="end"
              className="w-[160px]"
            >
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Make a copy</DropdownMenuItem>
              <DropdownMenuItem>Favorite</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={task.label}>
                    {labels.map((label) => (
                      <DropdownMenuRadioItem
                        key={label.value}
                        value={label.value}
                      >
                        {label.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          <div className="flex mt-4 flex-row justify-between items-center">
            <p className="">{task.description}</p>
            <div className=" aspect-square">
              <Avatar>
                <AvatarFallback className=" ring-1 ring-black p-4">
                  {userName?.firstName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
