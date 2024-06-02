import { CardsStats } from "@/components/charts/chart"
import { useUserContext } from "@/components/context/user"
import KanbanHeader from "@/components/header/kanban-header"
import { ProjectTabs } from "@/components/tabs/project-tabs"
import { getUsersTaskHistory } from "@/db/collections/task-track-history"
import { Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function ProjectSummaryPage() {
  const { userId, employes } = useUserContext()

  const [resData, setResData] = useState([])

  useEffect(() => {
    if (!userId) return
    getUsersTaskHistory(employes.map((emp) => emp.uid)).then((data) => {
      console.log("data", data)
      setResData(data)
    })
  }, [userId])

  const mappedData = resData.map((element) => {
    const user = employes.find((emp) => emp.uid === element.userId)
    const startAt = new Timestamp(
      element.startAt.seconds,
      element.startAt.nanoseconds
    ).toDate()
    const endAt = new Timestamp(
      element.endAt.seconds,
      element.endAt.nanoseconds
    ).toDate()

    const hours = Math.abs(endAt - startAt) / 36e5
    const minutes = Math.abs(endAt - startAt) / 6e4
    const seconds = Math.abs(endAt - startAt) / 1e3

    return { ...element, user, hours, minutes, seconds }
  })
  // merge hours to same user
  const mergedData = mappedData.reduce((acc, curr) => {
    const found = acc.find((element) => element?.userId === curr?.userId)

    if (found) {
      found.minutes += curr.minutes
      found.tasks += 1
    } else {
      acc.push({ ...curr, tasks: 1 })
    }

    return acc
  }, [])

  return (
    <div className="ms-2">
      <KanbanHeader />
      <ProjectTabs />
      <div className="grid grid-cols-2 gap-6">
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
  )
}
