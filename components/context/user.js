import { getUsers } from "@/db/collections/user"
import { auth } from "@/init/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/router"

const { createContext, useContext, useState, useEffect } = require("react")

const UserCtx = createContext()

export const UserCtxProvider = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const [refetch, setRefetch] = useState(false)

  const triggerRefetch = () => {
    setRefetch((prev) => !prev)
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)

      if (!user) router.push("/login")

      if (
        user &&
        (router.pathname === "/login" || router.pathname === "/signup")
      ) {
        router.push("/dashboard")
      }
    })
  }, []) 

  useEffect(() => {
    if (!user) return
    getUsers().then((users) => {
      console.log("users", users)
      setData(users)
    })
  }, [user,refetch])

  const addNewUser = (newUser) => {
    setData((prev) => [newUser, ...prev])
  }

  return (
    <UserCtx.Provider
      value={{ user, userId: user?.uid, data, addNewUser, triggerRefetch }}
    >
      {children}
    </UserCtx.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserCtx)

  if (!context) {
    throw new Error("useUserContext must be used within a ProjectProvider")
  }

  return context
}
