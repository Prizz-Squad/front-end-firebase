import React, { useEffect, useState } from "react"
import { useUserContext } from "../context/user"

const Wrapper = ({ requiredRight, children }) => {
  const [hasPermission, setHasPermission] = useState()
  const { data, userId } = useUserContext()

  const userData = data.find((element) => element.uid === userId)

  useEffect(() => {
    const hasPermission = requiredRight.includes(userData?.role)
    setHasPermission(hasPermission)
  }, [userData])

  return hasPermission ? children : ""
}

export default Wrapper
