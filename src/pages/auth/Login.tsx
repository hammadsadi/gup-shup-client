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
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "@/components/modules/Shared/PageHeader";
import { Helmet } from "react-helmet";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

const formSchema = z.object({
  login: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((value) => {
      // Check if it's an email or phone number
      const isEmail = z.string().email().safeParse(value).success;
      const isPhone = z
        .string()
        .min(10)
        .max(15)
        .regex(/^[0-9+\- ]+$/)
        .safeParse(value).success;
      return isEmail || isPhone;
    }, "Please enter a valid email or phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const navigate = useNavigate();
  const [loginUser] = useLoginMutation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        email: data.login,
        password: data.password,
      };
      const resData = await loginUser(payload).unwrap();
      if (resData?.success) {
        toast.success("Login successful! Redirecting to dashboard...");
        dispatch(setUser(resData.data));
        navigate("/");
      }
      if (!resData?.success) {
        toast.error(resData?.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Watch the login field to determine if it's email or phone
  const loginValue = watch("login");
  const isEmail = z.string().email().safeParse(loginValue).success;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> Login Page </title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="w-full pt-0 shadow-xl rounded-2xl overflow-hidden border-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <CardHeader className="space-y-1 p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      Welcome Back
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Sign in to your Messenger account
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
                {/* Email/Phone Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="login"
                      className="text-sm font-medium text-gray-700"
                    >
                      {isEmail ? "Email Address" : "Phone Number"}
                    </Label>
                    <button
                      type="button"
                      onClick={() =>
                        setLoginMethod(
                          loginMethod === "email" ? "phone" : "email"
                        )
                      }
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Use {loginMethod === "email" ? "phone number" : "email"}{" "}
                      instead
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login"
                      type={loginMethod === "email" ? "email" : "tel"}
                      {...register("login")}
                      disabled={loading}
                      className="pl-10 h-11"
                      placeholder={
                        loginMethod === "email"
                          ? "you@example.com"
                          : "+1 (555) 123-4567"
                      }
                    />
                    <Icons.mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.login && (
                    <p className="text-sm text-red-600">
                      {errors.login.message}
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
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
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

export default Login;
