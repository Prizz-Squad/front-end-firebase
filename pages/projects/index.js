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
import { Loader2, Plus } from "lucide-react"

export const ProjectSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
})

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState()
  const [isLoading, setIsLoading] = useState()

  const [_data, setdata] = useState([])
  const { data, addNewProject, triggerRefetch } = useProjectContext()

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
    setIsLoading(true)
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
      triggerRefetch()
      setIsLoading(false)
      setIsOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild onClick={() => setIsOpen(true)}>
            <Button variant="outline">
              <Plus className="h-4" />
              Create Project
            </Button>
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
      <DataTable columns={columns} data={data} />
    </div>
  )
}
