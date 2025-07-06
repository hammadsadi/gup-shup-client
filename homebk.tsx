import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/modules/Shared/Icons/Icons";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loggedInUserSelector, setUser } from "@/redux/features/auth/authSlice";
import { useLogOutUserMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const HomeChatPage = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [onlineFriends] = useState(12);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const loggedInUser = useAppSelector(loggedInUserSelector);
  const [logOutUser] = useLogOutUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Sample data
  const chats = [
    {
      id: "1",
      name: "Alex Johnson",
      lastMessage: "See you tomorrow!",
      time: "2:45 PM",
      unread: 2,
      avatar: "/avatars/alex.jpg",
      online: true,
    },
    {
      id: "2",
      name: "Design Team",
      lastMessage: "Maria: I uploaded the new assets",
      time: "11:30 AM",
      unread: 0,
      avatar: "/avatars/team.jpg",
      isGroup: true,
    },
    {
      id: "3",
      name: "Sarah Williams",
      lastMessage: "Thanks for the help!",
      time: "Yesterday",
      unread: 1,
      avatar: "/avatars/sarah.jpg",
      online: true,
    },
    {
      id: "4",
      name: "David Kim",
      lastMessage: "Let me check and get back to you",
      time: "Monday",
      unread: 0,
      avatar: "/avatars/david.jpg",
    },
  ];

  const messages = activeChat
    ? [
        {
          id: "1",
          text: "Hey there! How are you?",
          time: "2:30 PM",
          sent: false,
        },
        {
          id: "2",
          text: "I'm doing great! Just finished that project.",
          time: "2:32 PM",
          sent: true,
        },
        {
          id: "3",
          text: "That's awesome! Want to grab coffee tomorrow?",
          time: "2:33 PM",
          sent: false,
        },
        {
          id: "4",
          text: "Definitely! How about 10am at Blue Bottle?",
          time: "2:45 PM",
          sent: true,
        },
      ]
    : [];

  useEffect(() => {
    // Simulate new message notification
    const timer = setTimeout(() => {
      if (unreadMessages < 5) {
        setUnreadMessages((prev) => prev + 1);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [unreadMessages]);

  useEffect(() => {
    // Reset sidebar state when switching between mobile and desktop
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const sendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleLogout = async () => {
    try {
      const data = await logOutUser(undefined).unwrap();
      if (data.success) {
        dispatch(setUser(null));
        toast.success("Logged out successfully!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Logout failed");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden",
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      )}
    >
      {/* Sidebar - Conditionally rendered based on screen size */}
      {(showSidebar || !isMobile) && (
        <div
          className={cn(
            "w-full md:w-80 border-r flex flex-col transition-all duration-300 ease-in-out",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white",
            isMobile
              ? showSidebar
                ? "fixed inset-0 z-50"
                : "hidden"
              : "relative"
          )}
        >
          {/* Mobile header */}
          {isMobile && (
            <div className="p-3 border-b flex items-center justify-between md:hidden">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Icons.chevronLeft className="h-5 w-5" />
              </button>
              <h2 className="font-semibold">Chats</h2>
              <div className="w-10"></div> {/* Spacer for alignment */}
            </div>
          )}

          {/* Header */}
          <div
            className={cn(
              "p-4 border-b flex items-center justify-between",
              darkMode ? "border-gray-700" : "border-gray-200",
              isMobile ? "hidden md:flex" : ""
            )}
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={loggedInUser?.photo} />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <h2 className="font-semibold">My Profile</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  "p-2 rounded-full",
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
              >
                {darkMode ? (
                  <Icons.sun className="h-5 w-5" />
                ) : (
                  <Icons.moon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className={cn(
                  "p-2 rounded-full",
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
                title="Logout"
              >
                <Icons.logout className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-3">
            <div
              className={cn(
                "flex items-center rounded-lg px-3 py-2",
                darkMode ? "bg-gray-700" : "bg-gray-100"
              )}
            >
              <Icons.search className="h-5 w-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search messages"
                className={cn(
                  "w-full bg-transparent outline-none",
                  darkMode ? "placeholder-gray-400" : "placeholder-gray-500"
                )}
              />
            </div>
          </div>

          {/* Status */}
          <div
            className={cn(
              "px-4 py-3 flex items-center justify-between border-b",
              darkMode ? "border-gray-700" : "border-gray-200"
            )}
          >
            <span className="font-medium">Active Now</span>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs",
                darkMode
                  ? "bg-green-900 text-green-300"
                  : "bg-green-100 text-green-800"
              )}
            >
              {onlineFriends} online
            </span>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={cn(
                  "flex items-center p-3 border-b cursor-pointer hover:bg-opacity-50",
                  darkMode
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-100",
                  activeChat === chat.id &&
                    (darkMode ? "bg-gray-700" : "bg-gray-100")
                )}
              >
                <div className="relative mr-3">
                  <Avatar>
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2",
                        darkMode
                          ? "border-gray-800 bg-green-500"
                          : "border-white bg-green-500"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    <span
                      className={cn(
                        "text-xs",
                        darkMode ? "text-gray-400" : "text-gray-500"
                      )}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p
                      className={cn(
                        "text-sm truncate",
                        darkMode ? "text-gray-400" : "text-gray-600",
                        chat.unread > 0 && "font-semibold"
                      )}
                    >
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded-full text-xs",
                          darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-800"
                        )}
                      >
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile header when chat is open */}
        {isMobile && activeChat && !showSidebar && (
          <div
            className={cn(
              "p-3 border-b flex items-center justify-between md:hidden",
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            )}
          >
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Icons.chevronLeft className="h-5 w-5" />
            </button>
            <h2 className="font-semibold">
              {chats.find((c) => c.id === activeChat)?.name}
            </h2>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        )}

        {activeChat ? (
          <>
            {/* Chat header - Desktop */}
            {!isMobile && (
              <div
                className={cn(
                  "p-3 border-b flex items-center justify-between",
                  darkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={chats.find((c) => c.id === activeChat)?.avatar}
                    />
                    <AvatarFallback>
                      {chats.find((c) => c.id === activeChat)?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {chats.find((c) => c.id === activeChat)?.name}
                    </h3>
                    <p
                      className={cn(
                        "text-xs",
                        darkMode ? "text-gray-400" : "text-gray-500"
                      )}
                    >
                      {chats.find((c) => c.id === activeChat)?.online
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className={cn(
                      "p-2 rounded-full",
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    )}
                  >
                    <Icons.phone className="h-5 w-5" />
                  </button>
                  <button
                    className={cn(
                      "p-2 rounded-full",
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    )}
                  >
                    <Icons.video className="h-5 w-5" />
                  </button>
                  <button
                    className={cn(
                      "p-2 rounded-full",
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    )}
                  >
                    <Icons.moreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div
              className={cn(
                "flex-1 p-4 overflow-y-auto",
                darkMode ? "bg-gray-900" : "bg-gray-50"
              )}
            >
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sent ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs md:max-w-md px-4 py-2 rounded-lg",
                        msg.sent
                          ? darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      )}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={cn(
                          "text-xs mt-1 text-right",
                          msg.sent
                            ? "text-blue-100"
                            : darkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div
              className={cn(
                "p-3 border-t",
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              )}
            >
              <div className="flex items-center space-x-2">
                <button
                  className={cn(
                    "p-2 rounded-full",
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}
                >
                  <Icons.plus className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message"
                    className={cn(
                      "pr-10",
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    )}
                  />
                  <button
                    className={cn(
                      "absolute right-2 top-2",
                      darkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    <Icons.smile className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={cn(
                    "p-2 rounded-full",
                    message.trim()
                      ? darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-500"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  <Icons.send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
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
        )}
      </div>

      {/* Right sidebar - Activity/Details - Desktop only */}
      {activeChat && !isMobile && (
        <div
          className={cn(
            "w-64 border-l hidden lg:block",
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          )}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Details</h3>
            <button
              className={cn(
                "p-1 rounded-full",
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              )}
            >
              <Icons.x className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarImage
                  src={chats.find((c) => c.id === activeChat)?.avatar}
                />
                <AvatarFallback>
                  {chats.find((c) => c.id === activeChat)?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-semibold text-lg">
                {chats.find((c) => c.id === activeChat)?.name}
              </h4>
              <p
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}
              >
                {chats.find((c) => c.id === activeChat)?.online
                  ? "Online"
                  : "Last seen today"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h5
                  className={cn(
                    "font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Shared Media
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded bg-cover bg-center",
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h5
                  className={cn(
                    "font-medium mb-2",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Customization
                </h5>
                <div className="space-y-2">
                  <button
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded",
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    )}
                  >
                    <span>Change theme</span>
                    <Icons.palette className="h-4 w-4" />
                  </button>
                  <button
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded",
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    )}
                  >
                    <span>Change emoji</span>
                    <Icons.smile className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeChatPage;
