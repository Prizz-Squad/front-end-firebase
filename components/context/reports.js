import { getProjects } from "@/db/collections/project"
import { getUsersTaskHistory } from "@/db/collections/task-track-history"
import { useUserContext } from "./user"
import { Timestamp } from "firebase/firestore"

const { createContext, useContext, useState, useEffect } = require("react")

const ReportsCtx = createContext()

export const ReportsCtxProvider = ({ children }) => {
  const { employes } = useUserContext()

  const [resData, setResData] = useState([])

  useEffect(() => {
    if (!employes.length) return
    getUsersTaskHistory(employes.map((emp) => emp.uid)).then((data) => {
      console.log("data", data)
      setResData(data)
    })
  }, [employes])

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
    <ReportsCtx.Provider
      value={{
        mergedData,
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
