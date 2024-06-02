import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const AvatarRow = ({ setSelectedEmployee, selectedEmployee, data }) => {


  console.log(data,"sadadas")
  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-row items-center">
        {data.map((dt, i) => (
          <Avatar
            key={i}
            onClick={() =>
              setSelectedEmployee((previous) =>
                previous.includes(dt.uid)
                  ? previous.filter((uid) => uid !== dt.uid)
                  : [...previous, dt.uid]
              )
            }
            className={`ring-white ring-1 cursor-pointer hover:ring-black hover:-translate-y-2 transition-transform duration-150 ease-in-out ${
              selectedEmployee.includes(dt.uid) ? "ring-black" : ""
            }`}
            style={{ margin: "-3px" }}
          >
            <AvatarFallback className="p-5">
              {dt?.firstName?.charAt(0).toUpperCase()} 
            </AvatarFallback>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  )
}

export default AvatarRow
