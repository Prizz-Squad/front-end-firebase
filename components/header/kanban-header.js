import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlugIcon, Plus } from "lucide-react"
import { z } from "zod"
import { createTask } from "@/db/collections/task"
import { toast } from "sonner"
import { SelectGroup } from "@radix-ui/react-select"
import { COLUMNS, DEPARTMENTSENUM, USERS } from "@/constants/enum"
import { Loader2 } from "lucide-react"
import { useUserContext } from "../context/user"
import { UserCombobox } from "../combobox/user"
import Wrapper from "../wrapper/wrapper"

const TaskSchema = z.object({
  name: z.string().nonempty("Please write the name"),
  description: z.string(),
  columnId: z.string(),
})

export default function KanbanHeader() {
  const { userId } = useUserContext()
  const [isOpen, setIsOpen] = useState()
  const [isLoading, setIsLoading] = useState()
  const [assigne,setAssigne] = useState()


  const defaultCols = [
    {
      title: "Design",
      variable: DEPARTMENTSENUM.DESIGN,
    },
    {
      title: "Caption",
      variable: DEPARTMENTSENUM.CAPTION,
    },
    {
      title: "Schedule",
      variable: DEPARTMENTSENUM.SCHEDULE,
    },
  ]

  const [priority, setPriority] = useState()
  const [department, setDepartment] = useState()

  const onChangePriority = (value) => {
    setPriority(value)
  }
  const onChangeDepartment = (value) => {
    setDepartment(value)
  }

  const form = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      name: "",
      description: "",
      columnId: COLUMNS.TODO,
      assignee: ""
    },
  })

  const onSubmit = async (values) => {
    setIsLoading(true)
    const validValues = {
      ...values,
      userId,
      priority: priority ? priority : "MEDIUM",
      department: department ? department : DEPARTMENTSENUM.DESIGN,
      assignee: assigne
    }

    try {
      await createTask(validValues)
      toast("Task created.")
      setIsLoading(false)
      setIsOpen(false)
      form.reset()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-between m-2">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Wrapper requiredRight={[USERS.ADMIN,USERS.MANAGER]}>
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
          <Button variant="outline">
            <Plus className="h-4" />
            Create Task
          </Button>
        </DialogTrigger>
        </Wrapper>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Fill in the form below to create a new task.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Task X"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Marketing campaign"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4" />
                    </FormItem>
                  )}
                />
                <div className="w-full items-center flex flex-row justify-between">
                  <p className=" font-semibold text-sm">Department</p>
                  <Select
                    onValueChange={onChangeDepartment}
                    defaultValue="DESIGN"
                  >
                    <SelectTrigger className="w-3/4">
                      <SelectValue placeholder="Design" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {defaultCols.map((dt, i) => (
                          <SelectItem value={dt.variable} key={i}>
                            {dt.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full items-center flex flex-row justify-between">
                  <p className=" font-semibold text-sm">Piority</p>
                  <Select onValueChange={onChangePriority}>
                    <SelectTrigger className="w-3/4">
                      <SelectValue
                        placeholder="Medium"
                        defaultValue={DEPARTMENTSENUM.DESIGN}
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
                <div className="w-full items-center flex flex-row justify-between">
                
                <p className=" font-semibold text-sm">Assigne</p>
                <UserCombobox
                  onSelect={(newUserId) => {
                    setAssigne(newUserId)
                   
                  }}
                  onlyEmployee
                />
                
              </div>
              </div>
              <DialogFooter asChild>
                <Button type="submit" disabled={isLoading}>
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
    </div>
  )
}
