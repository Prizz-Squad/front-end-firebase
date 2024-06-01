import { useRouter } from "next/router"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { ScrollArea } from "@radix-ui/react-scroll-area"
export const ProjectTabs = () => {
  const router = useRouter()

  const tabs = [
    {
      id: "summary",
      label: "Summary",
      onClick: () => router.push("/projects/1/summary"),
      path: "/projects/[id]/summary",
    },
    {
      id: "board",
      label: "Board",
      onClick: () => router.push("/projects/1/board"),
      path: "/projects/[id]/board",
    },
    {
      id: "list",
      label: "List",
      onClick: () => router.push("/projects/1/list"),
      path: "/projects/[id]/list",
    },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   onClick: () => router.push("/projects/1/settings"),
    //   path: "/projects/[id]/settings"

    // },
  ]

  console.log(router.pathname)

  return (
    <ScrollArea className="overflow-x-auto my-2 scrollbar-hide">
      <Tabs className="w-[800px]">
        <TabsList className="flex flex-row w-full">
          {tabs.map((tab) => (
            <TabsTrigger
              className={`w-full ${
                router.pathname === tab.path ? "bg-white" : ""
              }`}
              key={tab.id}
              value={tab.id}
              onClick={tab.onClick}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </ScrollArea>
  )
}
