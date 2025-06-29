import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/modules/Shared/Icons";
import { Link } from "react-router-dom";
import PageHeader from "@/components/modules/Shared/PageHeader";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type FormData = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Backend API call here
      console.log("User registered:", data);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader hTitle="Create Account Page" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full pt-0 max-w-md mx-auto shadow-xl rounded-2xl overflow-hidden border-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <CardHeader className="space-y-1 p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      Join Messenger
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Connect with friends and colleagues
                    </CardDescription>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icons.message className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      {...register("name")}
                      disabled={loading}
                      className="pl-10 h-11"
                      placeholder="John Doe"
                    />
                    <Icons.user className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled={loading}
                      className="pl-10 h-11"
                      placeholder="you@example.com"
                    />
                    <Icons.mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      disabled={loading}
                      className="pl-10 h-11"
                      placeholder="+1 (555) 123-4567"
                    />
                    <Icons.phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      disabled={loading}
                      className="pl-10 pr-10 h-11"
                      placeholder="••••••••"
                    />
                    <Icons.lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Icons.eyeOff className="h-5 w-5" />
                      ) : (
                        <Icons.eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with 1 uppercase and 1 number
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Register Now"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterForm;
