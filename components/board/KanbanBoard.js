import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useEffect, useMemo, useRef, useState } from "react"

import { BoardColumn, BoardContainer } from "./BoardColumn"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import {
  ArrowRight,
  Bolt,
  Captions,
  Edit,
  Paperclip,
  PaperclipIcon,
  Timer,
} from "lucide-react"
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
import { useTaskContext } from "../context/tasks"
import {
  addCaptionToTask,
  addImagePostDateToTask,
  addImageToTask,
  changeTaskAssignee,
  changeTaskColId,
  changeTaskDepartment,
  changeTaskPriority,
  changeTaskStatus,
  toggleIsTaskCompleted,
} from "@/db/collections/task"
import { createComment, getCommentsSnapshot } from "@/db/collections/comments"
import { Checkbox } from "../ui/checkbox"
import { COLUMNS, DEPARTMENTS, USERS } from "@/constants/enum"
import { DepsMultiPicker } from "../dropdown/deps-multi-picker"
import { useRouter } from "next/router"
import AvatarRow from "../avatars/AvatarRow"
import { uploadFileToBucket } from "@/db/storage/task-images"
import { createNotification } from "@/db/collections/notification"
import { useProjectContext } from "../context/project"
import { useUserContext } from "../context/user"
import { UserCombobox } from "../combobox/user"
import { formatDistanceToNow } from "date-fns"
import { Timestamp } from "firebase/firestore"
import Image from "next/image"
import Wrapper from "../wrapper/wrapper"
import { Calendar } from "../ui/calendar"
import { createTaskTrackHistory } from "@/db/collections/task-track-history"

const defaultCols = [
  {
    id: COLUMNS.TODO,
    title: "Todo",
  },
  {
    id: COLUMNS.IN_PROGRESS,
    title: "In progress",
  },
  {
    id: COLUMNS.DONE,
    title: "Done",
  },
]
export function KanbanBoard({ cols = defaultCols }) {
  //user data
  const { data } = useUserContext()

  const router = useRouter()
  const { userId, user, dbUser } = useUserContext()
  const { currentProjectId } = useProjectContext()
  const { snapshotData: tasks, setSnapshotData: setTasks } = useTaskContext()
  const [columns, setColumns] = useState(cols)
  const pickedUpTaskColumn = useRef(null)
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

  const [activeColumn, setActiveColumn] = useState(null)

  const [activeTask, setActiveTask] = useState(null)

  const [showDialog, setShowDialog] = useState(false)
  const [dialogTask, setDialogTask] = useState(null)

  const [globalFilter, setGlobalFilter] = useState("")

  const urlDeps = router.query.deps
  const urlsDepsArray = urlDeps ? urlDeps.split(",") : []

  const [selectedEmployee, setSelectedEmployee] = useState([])

  const filteredTasks = useMemo(() => {
    const shouldMatchDeps = urlsDepsArray.length > 0
    const shouldMatchEmployee = selectedEmployee.length > 0
    return tasks.filter((task) => {
      const nameMatch = task.name
        ?.toLowerCase()
        .includes(globalFilter.toLowerCase())
      const depsMatch = urlsDepsArray.includes(task.department)

      const employeeMatch = selectedEmployee.includes(task.assignee)

      if (shouldMatchEmployee) {
        return shouldMatchDeps
          ? nameMatch && depsMatch && employeeMatch
          : nameMatch && employeeMatch
      }

      const isUserEmployee = dbUser?.role === USERS.EMPLOYEE

      const isUserEmployeeMatch = isUserEmployee
        ? task.assignee === userId
        : true

      if (!isUserEmployeeMatch) return false

      return shouldMatchDeps ? nameMatch && depsMatch : nameMatch
    })
  }, [tasks, urlsDepsArray, dbUser, globalFilter])

  useEffect(() => {
    // update the task in dialog if it's open, when the task is updated
    if (!showDialog || !dialogTask) return
    const updatedTask = tasks.find((task) => task.id === dialogTask.id)
    if (updatedTask) {
      setDialogTask(updatedTask)
    }
  }, [tasks])

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
        return `Picked up Task ${active.data.current.task.name} at position: ${
          taskPosition + 1
        } of ${tasksInColumn.length} in column ${column?.title}`
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
          return `Task ${active.data.current.task.name} was moved over column ${
            column?.title
          } in position ${taskPosition + 1} of ${tasksInColumn.length}`
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
        const { task } = active.data.current
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          task.columnId
        )
        onTaskColumnChangedEvent(task)
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

  return (
    <>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Start typing to filter..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm my-4"
        />
        <Wrapper requiredRight={[USERS.ADMIN, USERS.MANAGER]}>
          <AvatarRow
            setSelectedEmployee={setSelectedEmployee}
            selectedEmployee={selectedEmployee}
            data={data}
          />
        </Wrapper>
        <DepsMultiPicker />
      </div>
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
      <TaskDialog task={dialogTask} show={showDialog} setShow={setShowDialog} />
    </>
  )

  function onTaskColumnChangedEvent(updatedTask) {
    const { id, columnId } = updatedTask
    changeTaskColId(id, columnId)

    createNotification({
      subject: "Task Moved",
      text: `Task ${updatedTask.name} has been moved to ${updatedTask.columnId} by ${user.email}`, //${userId}
      name: user.firstName || user.email,
      email: user.email,
      labels: ["Completed"],
      userId,
      projectId: currentProjectId,
      taskId: id,
    })
  }

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

const TaskDialog = ({ task, show, setShow }) => {
  const fileInput = useRef(null)
  const { currentProjectId } = useProjectContext()
  const { userId, user, data } = useUserContext()
  const [inputValue, setInputValue] = useState("")
  const [comments, setComments] = useState([])
  const [isCompleted, setIsCompleted] = useState(task?.isCompleted || false)

  const [showCaptionsDialog, setShowCaptionsDialog] = useState(false)
  const [caption, setCaption] = useState("")

  const [showCarouselIdx, setShowCarouselIdx] = useState(-1)

  const [scheduleDialogImgIdx, setScheduleDialogImgIdx] = useState(-1)

  const userNameAssigned = data.find((element) => element.uid === task?.assignee)
  const userNameReporter = data.find((element) => element.uid === task?.userId)

  const handleButtonClick = () => {
    fileInput.current.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]

    uploadFileToBucket({
      imageUpload: file,
      onSuccess: (url) => {
        toast("File uploaded successfully")
        addImageToTask(task.id, url)

        createNotification({
          subject: "Task Image Added",
          text: `An image has been added to ${task.name} by ${user.email}`, //${userId}
          name: user.firstName || user.email,
          email: user.email,
          labels: ["Image"],
          userId,
          projectId: currentProjectId,
          taskId: task.id,
          imageLink: url,
        })
      },
    })
  }

  const [editModeCommentId, setEditModeCommentId] = useState("")

  useEffect(() => {
    if (!task) return
    getCommentsSnapshot(
      (comments) => {
        setComments(comments)
      },
      { taskId: task.id }
    )
  }, [task])

  const handleCreateComment = ({ text }) => {
    createComment({
      taskId: task.id,
      text,
      userId: userId,
      date: new Date(),
    })
  }
  const onSubmitUpdatePriority = async (selectedValue) => {
    try {
      await changeTaskPriority(task.id, selectedValue)
      toast("Priority succesfully changed")
      createNotification({
        subject: "Task Priority Changed",
        // text: `Task ${task.name} has been moved to ${updatedTask.columnId} by ${user.email}`, //${userId}
        text: `The priority of ${task.name} has been changed to ${selectedValue} by ${user.email}`, //${userId}
        name: user.firstName || user.email,
        email: user.email,
        labels: ["Completed"],
        userId,
        projectId: currentProjectId,
        taskId: task.id,
      })
    } catch (error) {
      console.error(error)
      toast.error("Priority has an error")
    }
  }

  const onSubmitUpdateStatus = async (columnId) => {
    try {
      await changeTaskStatus(task.id, columnId)
      toast("Status succesfully changed")
    } catch (error) {
      console.error(error)
      toast.error("Priority has an error")
    }
  }

  return (
    <>
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent className="flex justify-between md:min-w-[45rem] lg:min-w-[60rem] h-[80%] flex-col md:flex-row">
          <div className="flex flex-col overflow-y-auto flex-1 justify-between border-r">
            <DialogHeader>
              <DialogTitle>{task?.name || "Title"}</DialogTitle>
              <div className="flex gap-4">
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

                <Button
                  variant="ghost"
                  className="px-1"
                  onClick={() => setShowCaptionsDialog(true)}
                >
                  <Captions size={20} />
                  Add caption
                </Button>
              </div>
              <DialogDescription>
                {task?.description || "Content"}
              </DialogDescription>
            </DialogHeader>

            <div>
              {task?.images && (
                <>
                  <div className="mb-3 border-b pb-2">
                    <h4 className="text-sm font-semibold my-2">Images</h4>
                    <div className="flex gap-1 cursor-pointer">
                      {task?.images.map((image) => (
                        <div
                          key={image}
                          className="flex flex-col items-center gap-1"
                        >
                          <img
                            key={image}
                            src={image}
                            alt="task image"
                            width={80}
                            height={80}
                            onClick={() => {
                              setShowCarouselIdx(task?.images.indexOf(image))
                            }}
                          />
                          {task?.department === DEPARTMENTS.SCHEDULE && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setScheduleDialogImgIdx(
                                  task?.images.indexOf(image)
                                )
                              }}
                            >
                              <Timer className="w-4 h-4" />
                              {task?.imageToDates?.[image]
                                ?.toDate()
                                .toLocaleDateString()}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {task?.caption && (
                <>
                  <div className="mb-3 border-b pb-2">
                    <h4 className="text-sm font-semibold mt-2">Caption</h4>
                    <div className="flex gap-x-2 mt-4 items-center flex-row">
                      {caption || task?.caption}
                    </div>
                  </div>
                </>
              )}
              <div className="mb-2">
                <h4 className="text-sm font-semibold mt-2">Comments</h4>
               
                {comments.map((comment) => {
                  const commentUser = data.find(
                    (element) => element.uid === comment.userId
                  )
                  return (
                    <div
                      key={comment.id}
                      className="flex justify-between items-center mt-4"
                    >
                      <div className="flex flex-row gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="overflow-hidden rounded-full hover:ring-1 hover:ring-black"
                        >
                        
                          <Avatar>
                            <AvatarFallback className=" ring-2 ring-black p-4">
                              {commentUser?.firstName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {commentUser && commentUser.firstName}
                            </p>
                            <span className="text-sm font-light">
                              {formatDistanceToNow(
                                new Timestamp(
                                  comment.date.seconds,
                                  comment.date.nanoseconds
                                ).toDate(),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </div>
                          {/* <p>{comment.text}</p> */}

                          {editModeCommentId === comment.id ? (
                            <div className=" w-[340px] flex flex-row ">
                              <Textarea
                                className="  w-full h-8"
                                value={comment.text}
                                onChange={(e) => {
                                  const { value } = e.target
                                  setComments((comments) =>
                                    comments.map((c) =>
                                      c.id === comment.id
                                        ? { ...c, text: value }
                                        : c
                                    )
                                  )
                                }}
                                onKeyDown={(e) => {
                                  const { value } = e.target
                                  if (e.key !== "Enter" || !value) return
                                  setEditModeCommentId("")
                                }}
                              />
                            </div>
                          ) : (
                            <p>{comment.text}</p>
                          )}
                        </div>
                      </div>

                      <div className="mr-2">
                        {editModeCommentId !== comment.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditModeCommentId(comment.id)}
                          >
                            <Edit className="h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div className="mt-4 me-4 flex gap-x-4 flex-row">
                  <div>
                    <Avatar>
                      <AvatarFallback className=" ring-2 ring-black p-4">
                        {userNameAssigned?.firstName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Textarea
                    className="w-full h-8"
                    placeholder="Write a comment"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    // on enter key press
                    onKeyDown={(e) => {
                      const { value } = e.target
                      if (e.key !== "Enter" || !value) return
                      handleCreateComment({ text: value })
                      setInputValue("")
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-around">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="isCompleted"
                  onCheckedChange={async (checked) => {
                    try {
                      setIsCompleted(checked)
                      await toggleIsTaskCompleted(task.id, checked)
                      createNotification({
                        subject: "Task Completed",
                        text: `Task ${task.name} has been marked as ${
                          checked ? "Completed" : "Incompleted"
                        } by ${user.email}`, //${userId}
                        name: user.firstName || user.email,
                        email: user.email,
                        labels: ["Completed"],
                        userId,
                        projectId: currentProjectId,
                        taskId: task.id,
                      })
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                  checked={isCompleted}
                />
                <label
                  htmlFor="isCompleted"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as done
                </label>
                <Badge variant={"outline"} className="ml-auto font-semibold">
                  {task?.department}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Select
                  onValueChange={(columnId) => onSubmitUpdateStatus(columnId)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={task?.columnId} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={COLUMNS.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={COLUMNS.TODO}>To-Do</SelectItem>
                      <SelectItem value={COLUMNS.DONE}>Done</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(selectedValue) =>
                    onSubmitUpdatePriority(selectedValue)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={
                        task?.priority.charAt(0).toUpperCase() +
                        task?.priority.slice(1)
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="m-1">
                <p className="font-bold text-xl mt-2">Details</p>

                <div className="flex mt-4 flex-row  gap-x-4 justify-between items-center">
                  <p className="">Assigne</p>
                  <Avatar>
                    <AvatarFallback className=" ring-2 ring-black p-4">
                      {userNameAssigned?.firstName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <UserCombobox
                    onSelect={(newUserId) => {
                      changeTaskAssignee(task.id, newUserId).then(() => {

                        const username = data.find((element) => element.uid  === newUserId)

                        toast("Assignee changed")
                        createNotification({
                          subject: "Task Assignee Changed",
                          text: `Task ${task.name} has been assigned to ${username.firstName} by ${user.email}`, //${userId}
                          name: user.firstName || user.email,
                          email: user.email,
                          labels: ["Assignee"],
                          userId,
                          projectId: currentProjectId,
                          taskId: task.id,
                          newUserId,
                        })
                        createTaskTrackHistory({
                          userId: task.assignee,
                          taskId: task.id,
                          startAt: task.createdAt,
                          endAt: Timestamp.now(),
                        })
                      })
                    }}
                    userId={task?.assignee}
                    onlyEmployee
                  />
                </div>
             
                <div className="flex mt-8 flex-row justify-between items-center">
                  <p className="">Reporter</p>
                  <Avatar>
                    <AvatarFallback className=" ring-2 ring-black p-4">
                      {userNameReporter?.firstName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start justify-between ">
              <div className="flex text-sm  flex-col gap-y-2">
                <p>Created 10 hours ago</p>
                <p>Updated 9 hours ago</p>
              </div>

              <div>
                {task?.department !== DEPARTMENTS.DESIGN && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const prevDepMap = {
                        [DEPARTMENTS.CAPTION]: DEPARTMENTS.DESIGN,
                        [DEPARTMENTS.SCHEDULE]: DEPARTMENTS.CAPTION,
                      }
                      const prevDep = prevDepMap[task.department]
                      if (!prevDep) return
                      changeTaskDepartment(task.id, prevDep)
                      setShow(false)
                    }}
                  >
                    Previous
                  </Button>
                )}
                {task?.department !== DEPARTMENTS.SCHEDULE && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShow(false)
                      const nextDepMap = {
                        [DEPARTMENTS.DESIGN]: DEPARTMENTS.CAPTION,
                        [DEPARTMENTS.CAPTION]: DEPARTMENTS.SCHEDULE,
                      }
                      const nextDep = nextDepMap[task.department]
                      if (!nextDep) return
                      changeTaskDepartment(task.id, nextDep)
                    }}
                  >
                    Next department
                    <ArrowRight className="w-5 h-5 ms-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showCaptionsDialog} onOpenChange={setShowCaptionsDialog}>
        <DialogContent className="flex items-end p-14 flex-col md:flex-row">
          <Textarea
            className="w-full h-8"
            placeholder="Write a caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCaptionsDialog(false)
                toast("Caption added")
                addCaptionToTask(task.id, caption)
                createNotification({
                  subject: "Task Caption Added",
                  text: `A caption has been added to ${task.name} by ${user.email}`, //${userId}
                  name: user.firstName || user.email,
                  email: user.email,
                  labels: ["Caption", "New"],
                  userId,
                  projectId: currentProjectId,
                  taskId: task.id,
                  caption,
                })
              }}
            >
              Add caption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCarouselIdx !== -1}
        onOpenChange={() => setShowCarouselIdx(-1)}
      >
        <DialogContent className='max-w-fit' >
          <Carousel className="w-full p-4  mx-auto">
            <CarouselContent className=''>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center">
                        <Image
                          src={task?.images?.[showCarouselIdx]}
                          alt="task image"
                          width={800}
                          height={800}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>

      <Dialog
        open={scheduleDialogImgIdx !== -1}
        onOpenChange={() => setScheduleDialogImgIdx(-1)}
      >
        <DialogContent className="flex justify-between">
          <Calendar
            mode="single"
            onSelect={(date) => {
              try {
                toast("Image is being scheduled")
                setScheduleDialogImgIdx(-1)
                addImagePostDateToTask({
                  id: task.id,
                  date,
                  image: task?.images?.[scheduleDialogImgIdx],
                })
                createNotification({
                  subject: "Task Image Schedule Added",
                  text: `An image has been scheduled to ${task.name} by ${user.email}`, //${userId}
                  name: user.firstName || user.email,
                  email: user.email,
                  labels: ["Completed", "Schedule"],
                  userId,
                  projectId: currentProjectId,
                  taskId: task.id,
                })
              } catch (error) {
                console.error(error)
                toast.error("Image schedule has an error")
              }
            }}
            className="rounded-md border mx-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
