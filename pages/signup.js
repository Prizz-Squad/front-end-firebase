import { SignupForm } from "@/components/forms/signup"
import { createUser } from "@/db/collections/user"
import { auth } from "@/init/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "sonner"

export default function SignupPage() {

  const [role, setRole] = useState("MANAGER")

  const router = useRouter()
  return (
    <main className="flex items-center justify-center">
      <SignupForm
        onSubmit={async (data) => {
          const { email, password, firstName, lastName } = data
          try {
            await createUserWithEmailAndPassword(auth, email, password)
            router.push("/dashboard")

            createUser({
              uid: auth.currentUser.uid,
              email,
              createdAt: new Date().toISOString(),
              firstName,
              lastName,
              role
            })
          } catch (error) {
            console.error("Error creating user", error)
            toast.error("Error creating user")
          }
        }}
        role={role} setRole={setRole}
      />
    </main>
  )
}
