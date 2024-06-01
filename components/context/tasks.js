import { getTasks, getTasksSnapshot } from "@/db/collections/task"

const { createContext, useContext, useState, useEffect } = require("react")

const TaskCtx = createContext()

export const TaskCtxProvider = ({ children }) => {
  const [data, setData] = useState([])
  const [refetch, setRefetch] = useState(false)

  const [snapshotData, setSnapshotData] = useState([])

  const triggerRefetch = () => {
    setRefetch((prev) => !prev)
  }

  useEffect(() => {
    getTasks().then((data) => {
      setData(data)
    })
  }, [refetch])
  useEffect(() => {
    getTasksSnapshot(setSnapshotData)
  }, [])

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
