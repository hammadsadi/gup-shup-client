import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/modules/Shared/Icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  {isSubmitted
                    ? "Check your email for next steps"
                    : "Enter your email to reset your password"}
                </CardDescription>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <Icons.key className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {isSubmitted ? (
              <div className="text-center space-y-6">
                <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <Icons.checkCircle className="h-5 w-5" />
                    <p>Password reset link sent successfully!</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  We've sent instructions to your email. Please check your inbox
                  and follow the link to reset your password.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSubmitted(false)}
                >
                  Resend Instructions
                </Button>
                <div className="text-sm text-gray-500">
                  Remember your password?{" "}
                  <a href="/login" className="text-indigo-600 hover:underline">
                    Sign in
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      {...register("email")}
                      disabled={isLoading}
                    />
                    <Icons.mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <a href="/login" className="text-indigo-600 hover:underline">
                    Sign in
                  </a>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          Need help?{" "}
          <a href="/support" className="text-indigo-600 hover:underline">
            Contact support
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
