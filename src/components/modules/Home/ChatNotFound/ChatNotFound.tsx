import { cn } from "@/lib/utils";
import { Icons } from "../../Shared/Icons/Icons";

const ChatNotFound = ({
  darkMode,
  isMobile,
  toggleSidebar,
}: {
  darkMode: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}) => {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center justify-center p-6",
        darkMode ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      <div
        className={cn(
          "w-32 h-32 rounded-full flex items-center justify-center mb-6",
          darkMode ? "bg-gray-800" : "bg-gray-200"
        )}
      >
        <Icons.messageSquare
          className={cn(
            "h-16 w-16",
            darkMode ? "text-gray-600" : "text-gray-400"
          )}
        />
      </div>
      <h2
        className={cn(
          "text-2xl font-bold mb-2",
          darkMode ? "text-gray-100" : "text-gray-900"
        )}
      >
        {isMobile ? "Select a chat to start" : "Select a chat"}
      </h2>
      <p
        className={cn(
          "text-center max-w-md",
          darkMode ? "text-gray-400" : "text-gray-500"
        )}
      >
        {isMobile
          ? "Tap on a conversation to start messaging"
          : "Choose a conversation from the sidebar to start messaging, or create a new one to connect with friends."}
      </p>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={cn(
            "mt-4 px-4 py-2 rounded-lg",
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          )}
        >
          Show Chats
        </button>
      )}
    </div>
  );
};

export default ChatNotFound;
