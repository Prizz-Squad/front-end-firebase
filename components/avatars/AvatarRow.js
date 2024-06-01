import React from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
const AvatarRow = ({setSelectedEmployee,selectedEmployee}) => {

  const avatars = [
    {
      id: 0,
      name: "Avatar1",
      img: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/93/9329d9ab276d6a5cb855f16ff976c53626e8f612.jpg"
    },
    {
      id: 1,
      name: "Avatar2",
      img: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/00/00442b9a5c43a13a7c8ccf739a73f267b614f54b.jpg"
    },
    {
      id: 2,
      name: "Avatar3",
      img: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/18/18ce7fa51ba70abdd0530f6fdbb7c394d417882b.jpg"
    },
    {
      id: 3,
      name: "Avatar4",
      img: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/79/791a569611ba7c6254cc2b2934cb27656887e503.jpg"
    }
  ]

  console.log(selectedEmployee,"selectedEmploye")
  return (
    <div className='flex flex-row items-center'>
<div className='flex flex-row items-center'>
  {avatars.map((dt, i) => (
    <Avatar
      key={i}
      onClick={() =>
        setSelectedEmployee((previous) =>
          previous.includes(dt.id)
            ? previous.filter((id) => id !== dt.id)
            : [...previous, dt.id]
        )
      }
      className={`ring-white ring-2 cursor-pointer hover:-translate-y-2 transition-transform duration-150 ease-in-out ${
        selectedEmployee.includes(dt.id) ? 'ring-blue-400' : ''
      }`}
      style={{ margin: '-5px' }}
    >
      <AvatarImage src={dt.img} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ))}
</div>


</div>

  
  )
}

export default AvatarRow
