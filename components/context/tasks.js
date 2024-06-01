import { getTasks, getTasksSnapshot } from "@/db/collections/task"
import { useProjectContext } from "./project"

const { createContext, useContext, useState, useEffect } = require("react")

const TaskCtx = createContext()

export const TaskCtxProvider = ({ children }) => {
  const { currentProjectId } = useProjectContext()
  const [snapshotData, setSnapshotData] = useState([])

  useEffect(() => {
    if (!currentProjectId) return
    getTasksSnapshot(setSnapshotData, { projectId: currentProjectId })
  }, [currentProjectId])

  return (
    <TaskCtx.Provider
      value={{
        snapshotData,
        setSnapshotData,
      }}
    >
      {children}
    </TaskCtx.Provider>
  )
}

export const useTaskContext = () => {
  const context = useContext(TaskCtx)

  if (!context) {
    throw new Error("useTaskContext must be used within a ProjectProvider")
  }

  return context
}
