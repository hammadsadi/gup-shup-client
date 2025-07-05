import { cn } from "@/lib/utils";
import { Icons } from "../Icons/Icons";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "subtle";
}

export function Loading({
  className,
  size = "md",
  variant = "default",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const variantClasses = {
    default: "text-gray-600 dark:text-gray-400",
    primary: "text-blue-500 dark:text-blue-400",
    subtle: "text-gray-400 dark:text-gray-500",
  };

  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      aria-label="Loading"
    >
      <Icons.loading
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
    </div>
  );
}
