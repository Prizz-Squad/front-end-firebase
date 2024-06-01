import { SignupForm } from "@/components/forms/signup"
import { createUser } from "@/db/collections/user"
import { auth } from "@/init/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/router"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  return (
    <main className="flex items-center justify-center">
      <SignupForm
        onSubmit={async (data) => {
          const { email, password } = data
          try {
            await createUserWithEmailAndPassword(auth, email, password)
            router.push("/dashboard")

            createUser({
              uid: auth.currentUser.uid,
              email,
              createdAt: new Date().toISOString(),
            })
          } catch (error) {
            console.error("Error creating user", error)
            toast.error("Error creating user")
          }
        }}
      />
    </main>
  )
}
