import { getProjects } from "@/db/collections/project"
import { getUsersTaskHistory } from "@/db/collections/task-track-history"
import { useUserContext } from "./user"
import { Timestamp } from "firebase/firestore"

const { createContext, useContext, useState, useEffect } = require("react")

const ReportsCtx = createContext()

const DATE_FILTERS = {
  TODAY: "TODAY",
  THIS_WEEK: "THIS_WEEK",
  THIS_MONTH: "THIS_MONTH",
}

export const ReportsCtxProvider = ({ children }) => {
  const { employes } = useUserContext()

  const [resData, setResData] = useState([])

  const [dateFilter, setDateFilter] = useState(DATE_FILTERS.TODAY)

  const dateMap = {
    [DATE_FILTERS.TODAY]: {
      getStartDate: () => new Date().setHours(0, 0, 0, 0),
      getEndDate: () => new Date().setHours(23, 59, 59, 999),
    },
    [DATE_FILTERS.THIS_WEEK]: {
      getStartDate: () => new Date().setHours(0, 0, 0, 0),
      getEndDate: () =>
        new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay())
        ).setHours(23, 59, 59, 999),
    },
    [DATE_FILTERS.THIS_MONTH]: {
      getStartDate: () => new Date().setHours(0, 0, 0, 0),
      getEndDate: () =>
        new Date(new Date().setDate(1)).setHours(23, 59, 59, 999),
    },
  }

  useEffect(() => {
    if (!employes.length) return
    const empIds = employes.map((emp) => emp.uid)
    getUsersTaskHistory({
      userIds: empIds,
      startDate: new Date(dateMap[dateFilter].getStartDate()),
      endDate: new Date(dateMap[dateFilter].getEndDate()),
    }).then((data) => {
      console.log("data", data)
      setResData(data)
    })
  }, [employes, dateFilter])

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

  const setTodaysDateFilter = () => {
    setDateFilter(DATE_FILTERS.TODAY)
  }
  const setThisWeekDateFilter = () => {
    setDateFilter(DATE_FILTERS.THIS_WEEK)
  }
  const setThisMonthDateFilter = () => {
    setDateFilter(DATE_FILTERS.THIS_MONTH)
  }

  return (
    <ReportsCtx.Provider
      value={{
        mergedData,

        dateFilter,
        setTodaysDateFilter,
        setThisWeekDateFilter,
        setThisMonthDateFilter,
      }}
    >
      {children}
    </ReportsCtx.Provider>
  )
}

export const useReportsCtx = () => {
  const context = useContext(ReportsCtx)

  if (!context) {
    throw new Error("useReportsCtx must be used within a ProjectProvider")
  }

  return context
}
