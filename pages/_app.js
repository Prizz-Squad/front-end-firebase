import Sidebar from "@/components/globalcomp/sidebar"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "@/styles/globals.css"
import { useRouter } from "next/router"

export default function App({ Component, pageProps }) {
  const router = useRouter()

  console.log(router.pathname, "query")

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <TooltipProvider>
        {router.pathname !== "/login" && router.pathname !== "/signup" && (
          <Sidebar />
        )}

        <div className="ml-0 sm:ml-14 ">
          <Component {...pageProps} />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}
