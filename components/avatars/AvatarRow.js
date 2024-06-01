import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const AvatarRow = ({ setSelectedEmployee, selectedEmployee, data }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-row items-center">
        {data.map((dt, i) => (
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
              selectedEmployee.includes(dt.id) ? "ring-blue-400" : ""
            }`}
            style={{ margin: "-5px" }}
          >
            <AvatarFallback className="p-4">
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
