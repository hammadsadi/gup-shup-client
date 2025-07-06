import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "../../Shared/Icons";

interface ImageMessageProps {
  image: string;
  time: string;
  sent: boolean;
  darkMode: boolean;
}

const ImageMessage = ({ image, time, sent, darkMode }: ImageMessageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div className="group relative max-w-[280px] md:max-w-[320px]">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl transition-all duration-200",
          isLoading && "animate-pulse",
          isError && "bg-gray-200 dark:bg-gray-700",
          sent
            ? darkMode
              ? "border border-gray-600"
              : "border border-blue-100"
            : darkMode
            ? "border border-gray-600"
            : "border border-gray-200"
        )}
      >
        {/* Image */}
        <img
          src={image}
          alt="Shared content"
          className={cn(
            "w-full object-cover transition-opacity duration-200",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setIsError(true);
          }}
        />

        {/* Loading skeleton */}
        {isLoading && (
          <div
            className={cn(
              "absolute inset-0",
              darkMode ? "bg-gray-700" : "bg-gray-200"
            )}
          />
        )}

        {/* Error state */}
        {isError && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              darkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            <Icons.imageOff className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Time and status */}
      <div
        className={cn(
          "mt-1 flex items-center justify-end space-x-1 text-xs",
          sent
            ? darkMode
              ? "text-blue-300"
              : "text-blue-600"
            : darkMode
            ? "text-gray-400"
            : "text-gray-500"
        )}
      >
        <span>{time}</span>
        {sent && (
          <Icons.check
            className={cn(
              "h-3 w-3",
              darkMode ? "text-blue-300" : "text-blue-600"
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ImageMessage;
