import { LoginForm } from "@/components/forms/login"
import { auth } from "@/init/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/router"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()

  return (
    <main className="flex items-center justify-center">
      <LoginForm
        onSubmit={async (data) => {
          const { email, password } = data
          try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push("/dashboard")
          } catch (error) {
            console.error("Error signing in", error)
            toast.error("Please check your email and password.")
          }
        }}
      />
    </main>
  )
}
