import { useMemo, useRef, useState } from "react"

import { BoardColumn, BoardContainer } from "./BoardColumn"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { TaskCard } from "./TaskCard"
import { hasDraggableData } from "./utils"
import { coordinateGetter } from "./multipleContainersKeyboardPreset"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Bolt, Paperclip, PaperclipIcon } from "lucide-react"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toBase64 } from "@/utils/files"
import { toast } from "sonner"

const defaultCols = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "in-progress",
    title: "In progress",
  },
  {
    id: "done",
    title: "Done",
  },
]

const initialTasks = [
  {
    id: "task1",
    columnId: "done",
    content: "Project initiation and planning",
  },
  {
    id: "task2",
    columnId: "done",
    content: "Gather requirements from stakeholders",
  },
  {
    id: "task3",
    columnId: "done",
    content: "Create wireframes and mockups",
  },
  {
    id: "task4",
    columnId: "in-progress",
    content: "Develop homepage layout",
  },
  {
    id: "task5",
    columnId: "in-progress",
    content: "Design color scheme and typography",
  },
  {
    id: "task6",
    columnId: "todo",
    content: "Implement user authentication",
  },
  {
    id: "task7",
    columnId: "todo",
    content: "Build contact us page",
  },
  {
    id: "task8",
    columnId: "todo",
    content: "Create product catalog",
  },
  {
    id: "task9",
    columnId: "todo",
    content: "Develop about us page",
  },
  {
    id: "task10",
    columnId: "todo",
    content: "Optimize website for mobile devices",
  },
  {
    id: "task11",
    columnId: "SCHEDULE",
    content: "Integrate payment gateway",
  },
  {
    id: "task12",
    columnId: "CAPTION",
    content: "Perform testing and bug fixing",
  },
  {
    id: "task13",
    columnId: "DESIGN",
    content: "Launch website and deploy to server",
  },
]
export function KanbanBoard({ cols = defaultCols }) {
  const [columns, setColumns] = useState(cols)
  const pickedUpTaskColumn = useRef(null)
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

  const [tasks, setTasks] = useState(initialTasks)

  const [activeColumn, setActiveColumn] = useState(null)

  const [activeTask, setActiveTask] = useState(null)

  const [showDialog, setShowDialog] = useState(false)
  const [dialogTask, setDialogTask] = useState(null)

  const [globalFilter, setGlobalFilter] = useState("")
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      return task.content.toLowerCase().includes(globalFilter.toLowerCase())
    })
  }, [tasks, globalFilter])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  )

  function getDraggingTaskData(taskId, columnId) {
    const tasksInColumn = filteredTasks.filter(
      (task) => task.columnId === columnId
    )
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId)
    const column = columns.find((col) => col.id === columnId)
    return {
      tasksInColumn,
      taskPosition,
      column,
    }
  }

  const announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id)
        const startColumn = columns[startColumnIdx]
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        )
        return `Picked up Task ${
          active.data.current.task.content
        } at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id)
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        )
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.content
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null
        return
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id)

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        )
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`
      }
      pickedUpTaskColumn.current = null
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null
      if (!hasDraggableData(active)) return
      return `Dragging ${active.data.current?.type} cancelled.`
    },
  }
  console.log(dialogTask, "tialog")

  const fileInput = useRef(null)

  const handleButtonClick = () => {
    fileInput.current.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    console.log("file", file) // Do something with the file

    const base64String = await toBase64(file)
    console.log("base64String", base64String)

    toast("File uploaded successfully")
  }

  return (
    <>
      <Input
        placeholder="Start typing to filter..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm my-4"
      />
      <DndContext
        accessibility={{
          announcements,
        }}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <BoardContainer>
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                tasks={filteredTasks.filter((task) => task.columnId === col.id)}
                onTaskClick={(task) => {
                  console.log("Task clicked: ", task)
                  setShowDialog(true)
                  setDialogTask(task)
                }}
              />
            ))}
          </SortableContext>
        </BoardContainer>

        <DragOverlay>
          {activeColumn && (
            <BoardColumn
              isOverlay
              column={activeColumn}
              tasks={filteredTasks.filter(
                (task) => task.columnId === activeColumn.id
              )}
            />
          )}
          {activeTask && <TaskCard task={activeTask} isOverlay />}
        </DragOverlay>
      </DndContext>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="flex justify-between p-14 md:min-w-[45rem] lg:min-w-[60rem] h-[80%]  flex-col md:flex-row">
          <div className="flex flex-col  w-[54%] justify-between">
            <DialogHeader>
              <DialogTitle>{dialogTask?.title || "Title"}</DialogTitle>
              <div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInput}
                  onChange={handleFileChange}
                />
                <Button
                  variant="ghost"
                  className="px-1"
                  onClick={handleButtonClick}
                >
                  <PaperclipIcon size={20} />
                  Attach a file
                </Button>
              </div>
              <DialogDescription>
                {dialogTask?.content || "Content"}
              </DialogDescription>
            </DialogHeader>
            <div>
              <div>
                <h4 className="text-sm font-semibold mt-2">Comments</h4>
                <div className="flex gap-x-2 mt-4 items-center flex-row">
                  <p className="">Show:</p>
                  <div className="flex flex-row gap-x-2">
                    <Badge>All</Badge>
                    <Badge>Comments</Badge>
                    <Badge>History</Badge>
                  </div>
                </div>
                <div className="mt-2 flex gap-x-4 flex-row">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Input className="w-full h-8" placeholder="Write a comment" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col min-w-2/3 justify-around">
            <div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="In Progress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="todo">To-Do</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="in-progress">High</SelectItem>
                      <SelectItem value="todo">Medium</SelectItem>
                      <SelectItem value="done">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="m-1">
                <p className="font-bold text-xl mt-2">Details</p>

                <div className="flex mt-4 flex-row justify-between items-center">
                  <p className="">Assigne</p>
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex mt-4  flex-row justify-between items-center">
                  <p className="mr-4">Label</p>
                  <div className="flex flex-row gap-x-2 flex-wrap">
                    <Badge>Bug</Badge>
                    <Badge>Feature</Badge>
                    <Badge>Documentation</Badge>
                  </div>
                </div>
                <div className="flex mt-4 flex-row justify-between items-center">
                  <p className="">Reporter</p>
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>{" "}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-between ">
              <div className="flex text-sm  flex-col gap-y-2">
                <p>Created 10 hours ago</p>
                <p>Updated 9 hours ago</p>
              </div>

              <div className="flex cursor-pointer flex-row text-center justify-center items-center">
                <Bolt className="w-5 h-5" />
                <p className="text-sm ml-1 mb-1">Configure</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )

  function onDragStart(event) {
    if (!hasDraggableData(event.active)) return
    const data = event.active.data.current
    if (data?.type === "Column") {
      setActiveColumn(data.column)
      return
    }

    if (data?.type === "Task") {
      setActiveTask(data.task)
      return
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (!hasDraggableData(active)) return

    const activeData = active.data.current

    if (activeId === overId) return

    const isActiveAColumn = activeData?.type === "Column"
    if (!isActiveAColumn) return

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId)

      const overColumnIndex = columns.findIndex((col) => col.id === overId)

      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  function onDragOver(event) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    if (!hasDraggableData(active) || !hasDraggableData(over)) return

    const activeData = active.data.current
    const overData = over.data.current

    const isActiveATask = activeData?.type === "Task"
    const isOverATask = overData?.type === "Task"

    if (!isActiveATask) return

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)
        const activeTask = tasks[activeIndex]
        const overTask = tasks[overIndex]
        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          activeTask.columnId = overTask.columnId
          return arrayMove(tasks, activeIndex, overIndex - 1)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = overData?.type === "Column"

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const activeTask = tasks[activeIndex]
        if (activeTask) {
          activeTask.columnId = overId
          return arrayMove(tasks, activeIndex, activeIndex)
        }
        return tasks
      })
    }
  }
}
