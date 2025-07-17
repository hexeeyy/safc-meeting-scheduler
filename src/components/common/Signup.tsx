import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginL } from "@/assets"
import Image from "next/image"
import Link from "next/link";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6 px-4 sm:px-0", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 bg-white">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-green-700">
                  Create an account
                </h1>
                <p className="text-green-700 text-balance">
                  Sign up to get started
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name" className="text-green-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="border-green-400 text-green-700 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-green-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  className="border-green-400 text-green-700 focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password" className="text-green-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="border-green-400 focus:ring-green-700"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password" className="text-green-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  className="border-green-400 focus:ring-green-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:opacity-80 text-white transition-colors duration-300"
              >
                Sign Up
              </Button>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 dark:text-blue-400 underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-gradient-to-r from-green-500 to-green-600 dark:bg-gray-900 relative md:block flex items-center justify-center">
            <style>
              {`
                .float {
                  animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                  100% { transform: translateY(0px); }
                }
              `}
            </style>
            <Image
              alt="South Asialink Finance Corporation Logo"
              src={loginL}
              width={400}
              height={400}
              className="mt-10 object-contain float"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-gray-600 dark:text-gray-400 text-center text-xs text-balance">
        By signing up, you agree to our{" "}
        <a
          href="#"
          className="text-green-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-700 dark:hover:text-blue-500"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-green-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-700 dark:hover:text-blue-500"
        >
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}
