import { columns } from "@/components/columns/project"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { userId } from "@/dummy-data/users"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createProject, getProjects } from "@/db/collections/project"
import { useProjectContext } from "@/components/context/project"

async function getData() {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Project X",
      description: "A project description.",
      userName: "John Doe",
      clientName: "ACME Inc.",
    },
    {
      id: "728ed52g",
      name: "Project Y",
      description: "Another project description.",
      userName: "Jane Doe",
      clientName: "ACME Inc.",
    },
    {
      id: "728ed52h",
      name: "Project Z",
      description: "Yet another project description.",
      userName: "John Doe",
      clientName: "ACME Inc.",
    },
  ]
}
export const ProjectSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
})

export default function DemoPage() {
  const [_data, setdata] = useState([])
  const { data, addNewProject } = useProjectContext()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const form = useForm({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const validData = {
        ...data,
        userId,
      }
      console.log("validData", validData)
      await createProject(validData)
      toast("Project created successfully")
      addNewProject(validData)
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <DialogDescription>
                    Fill in the form below to create a new project.
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
                            placeholder="Project X"
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
                  {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Client
                </Label>

                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Clients</SelectLabel>
                      <SelectItem value="acme">ACME Inc.</SelectItem>
                      <SelectItem value="widget-co">Widget Co.</SelectItem>
                      <SelectItem value="initech">Initech</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div> */}
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
