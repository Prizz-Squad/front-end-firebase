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

export default function DemoPage() {
  const [data, setdata] = useState([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    getData().then((data) => {
      setdata(data)
    })
  }, [])

  const handleSave = () => {
    console.log("Form submitted")
    try {
      const newProject = {
        name,
        description,
        userId,
      }
      console.log(newProject)

      // TODO: Save the new project to the database.

      setName("")
      setDescription("")
      toast("Project created successfully")
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
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project X"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Marketing campaign"
                  className="col-span-3"
                />
              </div>
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
              <Button type="submit" onClick={handleSave}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
