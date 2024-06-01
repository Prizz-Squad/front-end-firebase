import { LoginForm } from "@/components/forms/login";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <main className="flex items-center justify-center">
      <LoginForm
        onSubmit={async (data) => {
          console.log("data", data);
          // TODO: should we post to nextjs api or directly to the backend?
          const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
              ...data,
              username: "anxhelo", // TODO: this is hardcoded atm
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const json = await res.json();
          console.log("json", json);
          const { token } = json;
          if (!token) {
            console.error("Invalid credentials");
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password.",
            });
            return;
          }
          router.push("/dashboard");
        }}
      />
    </main>
  );
}
