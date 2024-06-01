import { getProjects } from "@/db/collections/project"

const { createContext, useContext, useState, useEffect } = require("react")

const ProjecTCtx = createContext()

export const ProjectCtxProvider = ({ children }) => {
  const [currentProjectId, setCurrentProjectId] = useState(null)
  const [data, setData] = useState([])
  const [refetch, setRefetch] = useState(false)

  const triggerRefetch = () => {
    setRefetch((prev) => !prev)
  }

  useEffect(() => {
    getProjects().then((data) => {
      setData(data)
    })
  }, [refetch])

  useEffect(() => {
    if (data.length > 0 && !currentProjectId) {
      setCurrentProjectId(data[0].id)
    }
  }, [data])

  const addNewProject = (newProject) => {
    setData((prev) => [newProject, ...prev])
  }

  return (
    <ProjecTCtx.Provider
      value={{
        data,
        triggerRefetch,
        addNewProject,
        currentProjectId,
        setCurrentProjectId,
      }}
    >
      {children}
    </ProjecTCtx.Provider>
  )
}

export const useProjectContext = () => {
  const context = useContext(ProjecTCtx)

  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider")
  }

  return context
}
