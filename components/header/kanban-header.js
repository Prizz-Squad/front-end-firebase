import React from "react"
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
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlugIcon, Plus } from "lucide-react"
import { z } from "zod"
import { createTask } from "@/db/collections/task"
import { userId } from "@/dummy-data/users"
import { toast } from "sonner"

const TaskSchema = z.object({
  name: z.string(),
  description: z.string(),
  department: z.string(),
})

export default function KanbanHeader() {
  const form = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = async (values) => {
    const validValues = {
      ...values,
      userId,
      status: "todo", //TODO: what is the status
    }
    console.log(validValues)

    await createTask(values)
    toast("Task created.")
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
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Design"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4" />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
