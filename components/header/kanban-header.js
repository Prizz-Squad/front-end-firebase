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
  FormDescription
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
import { userId } from "@/dummy-data/users"
import { toast } from "sonner"
import { SelectGroup } from "@radix-ui/react-select"
import { COLUMNS, DEPARTMENTSENUM } from "@/constants/enum"

const TaskSchema = z.object({
  name: z.string(),
  description: z.string(),
  columnId: z.string(),
})

export default function KanbanHeader() {

  const defaultCols = [
    {
      title: "Design",
      variable: DEPARTMENTSENUM.DESIGN
    },
    {
      title: "Caption",
      variable: DEPARTMENTSENUM.CAPTION
    },
    {
      title: "Schedule",
      variable: DEPARTMENTSENUM.SCHEDULE
    },
  ]


  const [priority,setPriority] = useState();
  const [department,setDepartment] = useState();


  const onChangePriority = (value) => {
    setPriority((value))
  }
  const onChangeDepartment = (value) => {
    setDepartment((value))
  }

  const form = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      name: "",
      description: "",
      columnId: COLUMNS.TODO,

    },
  })

  const onSubmit = async (values) => {
    const validValues = {
      ...values,
      userId,
      priority: priority,
      department: department 

    }
    console.log(values,"values")
    console.log(validValues,"validValues")

    await createTask(validValues)
    toast("Task created.")
    form.reset()
    
  }

  return (
    <div className="flex justify-between m-2">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="h-4" />
            Create Task
          </Button>
        </DialogTrigger>
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
               <Select onValueChange={onChangeDepartment}>
                <SelectTrigger className="w-3/4">
                  <SelectValue placeholder="Design" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                   {
                    defaultCols.map((dt,i)=> (
                      <SelectItem value={dt.variable} key={i}>{dt.title}</SelectItem>

                    ))
                   }
               
                  </SelectGroup>
                </SelectContent>
              </Select>
               </div>

               <div className="w-full items-center flex flex-row justify-between">
               <p className=" font-semibold text-sm">Piority</p>
               <Select onValueChange={onChangePriority}>
                <SelectTrigger className="w-3/4">
                  <SelectValue placeholder="Medium" />
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
              </div>
             <div className="flex flex-row justify-end">
             <DialogTrigger asChild>
                <Button type="submit">Save changes</Button>
              </DialogTrigger>
             </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
