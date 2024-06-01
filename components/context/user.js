import { auth } from "@/init/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/router"

const { createContext, useContext, useState, useEffect } = require("react")

const UserCtx = createContext()

export const UserCtxProvider = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  console.log(user)
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

  return <UserCtx.Provider value={{}}>{children}</UserCtx.Provider>
}

export const useUserContext = () => {
  const context = useContext(UserCtx)

  if (!context) {
    throw new Error("useUserContext must be used within a ProjectProvider")
  }

  return context
}
