import { LoginForm } from "@/components/login-form"
import { EchoTest } from "@/components/echo-test"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        {/*<EchoTest />*/}
      </div>
    </div>
  )
}
