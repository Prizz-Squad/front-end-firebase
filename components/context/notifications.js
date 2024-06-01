import { getNotifsSnapshot } from "@/db/collections/notification"

const { createContext, useContext, useState, useEffect } = require("react")

const NotificationCtx = createContext()

export const NotificationCtxProvider = ({ children }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    getNotifsSnapshot((notifs) => {
      setData(notifs)
    })
  }, [])

  return (
    <NotificationCtx.Provider value={{ data }}>
      {children}
    </NotificationCtx.Provider>
  )
}

export const useNotificationContext = () => {
  const context = useContext(NotificationCtx)

  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a ProjectProvider"
    )
  }

  return context
}
