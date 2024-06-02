"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";

import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  userId: z.string(),
  name: z.string(),
  columnId: z.string(),
  priority: z.string(),
});

import { labels } from "@/constants/list";
import { useState } from "react";
import { deleteTask, updateTask, updateTask2 } from "@/db/collections/task";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

export function TasksListRowActions({ row }) {
  const task = taskSchema.parse(row.original);

  const [priority, setPriority] = useState();
  const [status, setStatus] = useState();
  const [name,setName] = useState()

  const onSubmit = async (e) => {
   e.preventDefault()
  
   const jsonTask = {
    columnId: status ? status : task.columnId,
    priority: priority ? priority : task.priority,
    name: name ? name : task.name
    
   }


   try {
    await updateTask2(row?.original?.id,jsonTask)
    setShowUpdateDialog(false)
    toast("Task updated")
   } catch (error) {
    
   }



  };

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task.name,
      columnId: task.columnId,
      priority: task.priority,
    },
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const [isLoading, setIsLoading] = useState();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
            Edit
            <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              project and remove its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              variant="destructive"
              onClick={async () => {
                setIsLoading(true);

                await deleteTask(row?.original?.id);
                setShowDeleteDialog(false);
                setIsLoading(false);
                toast("Task deleted.");
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={(e)=> onSubmit(e)}>
              <DialogHeader>
                <DialogTitle>Update Project</DialogTitle>
                <DialogDescription>
                  Fill in the form below to update the project.
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
                          defaultValue={task.name}
                          onChangeCapture={e => setName(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4" />
                    </FormItem>
                  )}
                />

            
                   <div className="flex flex-row justify-between gap-x-2 items-center ">
              <FormLabel className='mb-2 mr-10'>Priority</FormLabel>
                <Select className=''  onValueChange={setPriority}>
                  <SelectTrigger className="w-full">
                  <SelectValue  placeholder={task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase()}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Task Priority</SelectLabel>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
                <div className="flex flex-row justify-between gap-x-2 items-center ">
              <FormLabel className='mb-2 mr-12'>Status</FormLabel>
                <Select  onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue  placeholder={task.columnId.charAt(0).toUpperCase() + task.columnId.slice(1).toLowerCase()}
 />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Task Status</SelectLabel>
                      <SelectItem value="TODO">Todo</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
              </div>
              <DialogFooter>
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
    </>
  );
}
