import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardsStats } from "@/components/charts/chart"
import { ReportsCtxProvider, useReportsCtx } from "@/components/context/reports"
import { useEffect, useState } from "react"
import { getRecentTasksSnapshot } from "@/db/collections/task"
import { useProjectContext } from "@/components/context/project"
import { z } from "zod"
import { useTaskContext } from "@/components/context/tasks"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "@/components/columns/tasks-list"

const lastWeekAmount = 1000
function Dashboard() {
  const {
    mergedData,
    setTodaysDateFilter,
    setThisWeekDateFilter,
    setThisMonthDateFilter,
  } = useReportsCtx()

  // const amountInPercentage =
  const toal = mergedData.reduce((acc, curr) => acc + curr.hours, 0)

  const closeAmountToLastWeek = Math.abs(toal - lastWeekAmount)
  // console.log("closeAmountToLastWeek", closeAmountToLastWeek)
  const { snapshotData: tasks, setSnapshotData: setTasks } = useTaskContext()

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-6 gap-4">
      <div className="grid grid-cols-2 gap-6">
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-4xl">
              {mergedData.reduce((acc, curr) => acc + curr.tasks, 0)} tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {closeAmountToLastWeek.toFixed(2)} hours to last week
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={25} aria-label="25% increase" />
          </CardFooter>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2">
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-4xl">
              {mergedData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(2)}{" "}
              hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% from last month
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={12} aria-label="12% increase" />
          </CardFooter>
        </Card>
      </div>
      <Tabs defaultValue="week">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="week" onClick={setTodaysDateFilter}>
                  Week
                </TabsTrigger>
                <TabsTrigger value="month" onClick={setThisWeekDateFilter}>
                  Month
                </TabsTrigger>
                <TabsTrigger value="year" onClick={setThisMonthDateFilter}>
                  Year
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex flex-col gap-4">
              <CardsStats
                data={mergedData}
                xDataKey={"user.firstName"}
                yDataKey={"hours"}
                title={"Time spent"}
                subTitle={`${Math.floor(
                  mergedData.reduce((acc, curr) => acc + curr.hours, 0)
                )} hours`}
                description={"Time spent by each user"}
              />

              <CardsStats
                data={mergedData}
                xDataKey={"user.firstName"}
                yDataKey={"tasks"}
                title={"Completed tasks"}
                subTitle={`${mergedData.reduce(
                  (acc, curr) => acc + curr.tasks,
                  0
                )} tasks`}
                description={"Tasks completed by each user"}
              />
            </div>
          </div>
          <div>
            <div>
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="pb-2">
                  <CardDescription>Recent Tasks</CardDescription>
                  <CardTitle className="text-2xl ">
                    {tasks.length} tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mt-3">
                    <DataTable
                      columns={columns.slice(0, -1)}
                      data={tasks}
                      hideSearch
                      hideFooter
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Tabs>
      <div className=""></div>
    </div>
  )
}

export default function DashBoardPage() {
  const { currentProjectId } = useProjectContext()
  const [recentTasks, setRecentTasks] = useState([])
  console.log("recentTasks", recentTasks)
  useEffect(() => {
    getRecentTasksSnapshot(setRecentTasks, { projectId: currentProjectId })
  }, [])

  return (
    <ReportsCtxProvider>
      <Dashboard />
    </ReportsCtxProvider>
  )
}
