import { columns } from "@/components/columns/user"
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
import { useUserContext } from "@/components/context/user"
import { SignupForm } from "@/components/forms/signup"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/init/firebase"
import { createUser } from "@/db/collections/user"

export const ProjectSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
})

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState()
  const [isLoading, setIsLoading] = useState()

  const { data, addNewProject, triggerRefetch } = useUserContext()

  const [role, setRole] = useState("MANAGER")

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
        role,
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
          <h1 className="text-2xl font-bold">Users</h1>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex gap-2">
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
              <Button variant="outline">
                <Plus className="h-4" />
                Create User
              </Button>
            </DialogTrigger>

            <Select onValueChange={setRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
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

          <DialogContent className="sm:max-w-[425px]">
            <SignupForm
              onSubmit={async (data) => {
                console.log("data", data)
                try {
                  const { email, password, firstName, lastName } = data
                  await createUserWithEmailAndPassword(auth, email, password)

                  createUser({
                    uid: auth.currentUser.uid,
                    email,
                    createdAt: new Date().toISOString(),
                    firstName,
                    lastName,
                  })
                  toast("User created successfully")
                  setIsOpen(false)
                  triggerRefetch()
                } catch (error) {
                  console.error("Error creating user", error)
                  toast.error("Error creating user")
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
