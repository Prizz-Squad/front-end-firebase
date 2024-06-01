import React, { useEffect, useState } from 'react'
import { useUserContext } from '../context/user'

const Wrapper = ({requiredRight,children}) => {
  
    const [hasPermission,setHasPermission] = useState()
    const {data,user} = useUserContext()
    
    const userData = data.find((element) => element.uid === user.uid)

    
    useEffect(() => {
        const hasPermission = requiredRight.includes(userData?.role)
        setHasPermission(hasPermission)
    }, [userData])

    return hasPermission ? children : "" 
    
    
}

export default Wrapper