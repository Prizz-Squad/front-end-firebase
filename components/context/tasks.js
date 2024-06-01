import { getTasks, getTasksSnapshot } from "@/db/collections/task"
import { useProjectContext } from "./project"

const { createContext, useContext, useState, useEffect } = require("react")

const TaskCtx = createContext()

export const TaskCtxProvider = ({ children }) => {
  const { currentProjectId } = useProjectContext()
  const [data, setData] = useState([])
  const [refetch, setRefetch] = useState(false)

  const [snapshotData, setSnapshotData] = useState([])

  const triggerRefetch = () => {
    setRefetch((prev) => !prev)
  }

  useEffect(() => {
    // TODO:we are fetching 2 times
    getTasks().then((data) => {
      setData(data)
    })
  }, [refetch])

  useEffect(() => {
    if (!currentProjectId) return
    getTasksSnapshot(setSnapshotData, { projectId: currentProjectId })
  }, [currentProjectId])

  // TODO: wtf does project have to do here
  const addNewProject = (newProject) => {
    setData((prev) => [newProject, ...prev])
  }

  return (
    <TaskCtx.Provider
      value={{
        data,
        triggerRefetch,
        snapshotData,
        addNewProject,
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
