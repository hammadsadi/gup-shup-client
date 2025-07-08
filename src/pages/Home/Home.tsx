import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/modules/Shared/Icons/Icons";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loggedInUserSelector, setUser } from "@/redux/features/auth/authSlice";
import { useLogOutUserMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import EmojiPicker, { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import Lottie from "lottie-react";
import emptyAnimation from "../../assets/animated-otfound.json";
import { ImageIcon } from "@/components/modules/Home/HomeIcons/ImageIcon";
import UserList from "@/components/modules/Home/ChatList/UserList";
import type { TUserList } from "@/types";
import ChatNotFound from "@/components/modules/Home/ChatNotFound/ChatNotFound";
import { format } from "date-fns";
import {
  useCreateChatMutation,
  useGetAllChatsQuery,
} from "@/redux/features/chat/chatApi";
import uploadImage from "@/utils/uploadImageToCloudinary";

const HomeChatPage = () => {
  const [activeChat, setActiveChat] = useState<TUserList | null>(null);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [onlineFriends] = useState(12);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const loggedInUser = useAppSelector(loggedInUserSelector);
  const [logOutUser] = useLogOutUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatImage, setChatImage] = useState<File | null>(null);
  const [chatCreate] = useCreateChatMutation();
  const { data, refetch } = useGetAllChatsQuery(activeChat?.id, {
    skip: !activeChat,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
  });
  const scrollChats = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (unreadMessages < 5) {
        setUnreadMessages((prev) => prev + 1);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [unreadMessages]);

  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sendMessage = async () => {
    // if (message.trim() || selectedImage) {
    //   console.log(chatImage);
    //   console.log("Message sent:", { text: message, image: selectedImage });
    //   setMessage("");
    //   setSelectedImage(null);
    // }
    let payload = {
      text: message,
      receiverId: activeChat?.id,
    };
    console.log(chatImage);
    let photoUrl = "";
    if (chatImage) {
      const imgUrl = await uploadImage(chatImage);
      photoUrl = imgUrl;
    }
    if (photoUrl) {
      (payload as any).photo = photoUrl;
    }

    const res = await chatCreate(payload).unwrap();
    if (res.success) {
      setMessage("");
      setSelectedImage(null);
      refetch();
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleChatSelect = () => {
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

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    scrollChats.current?.scrollTo({
      top: scrollChats.current.scrollHeight,
      behavior: "smooth",
    });
  }, [data?.data]);

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden",
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      )}
    >
      {/* Sidebar */}
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
              <div className="w-10"></div>
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
              <div className="flex flex-col">
                <h2 className="font-semibold">{loggedInUser?.name}</h2>
                <Link to="/edit-profile" className="inline-block text-xs">
                  Profile Settings
                </Link>
              </div>
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
            <UserList
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              handleChatSelect={handleChatSelect}
              scrollChats={scrollChats}
            />
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
            <h2 className="font-semibold">{activeChat?.name}</h2>
            <div className="w-10"></div>
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
                    <AvatarImage src={activeChat?.photo} />
                    <AvatarFallback>
                      {activeChat?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activeChat?.name}</h3>
                    <p
                      className={cn(
                        "text-xs",
                        darkMode ? "text-gray-400" : "text-gray-500"
                      )}
                    >
                      Online
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
              ref={scrollChats}
              className={cn(
                "flex-1 p-4 overflow-y-auto",
                darkMode ? "bg-gray-900" : "bg-gray-50"
              )}
            >
              <div className="space-y-4">
                <div
                  className={cn(
                    "flex-1 p-4 overflow-y-auto min-h-screen",
                    darkMode ? "bg-gray-900" : "bg-gray-50"
                  )}
                >
                  <div className="space-y-4">
                    {data?.data?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center mt-10 text-muted-foreground">
                        <Lottie
                          animationData={emptyAnimation}
                          loop
                          autoPlay
                          className="w-60 h-60"
                        />
                        <p className="text-lg font-semibold">No messages yet</p>
                        <p className="text-sm">
                          Start a conversation to see messages here.
                        </p>
                      </div>
                    ) : (
                      data?.data?.map((chat: any) => {
                        const isMe = chat.senderId === loggedInUser?.id;
                        const text = chat.message?.text;
                        const photo = chat.message?.photo;
                        const time = format(
                          new Date(chat.createdAt),
                          "hh:mm a"
                        );
                        const status = chat.status;
                        const avatar = isMe
                          ? loggedInUser?.photo
                          : chat.sender?.photo;
                        const name = isMe
                          ? loggedInUser?.name
                          : chat.sender?.name;

                        return (
                          <div
                            key={chat.id}
                            className={cn(
                              "flex items-end gap-2",
                              isMe ? "justify-end" : "justify-start"
                            )}
                          >
                            {/* Left avatar */}
                            {!isMe && (
                              <img
                                src={avatar}
                                alt={name}
                                className="w-8 h-8 rounded-full border shadow-sm"
                              />
                            )}

                            {/* Chat bubble */}
                            <div
                              className={cn(
                                "relative max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow",
                                isMe
                                  ? darkMode
                                    ? "bg-blue-700 text-white"
                                    : "bg-blue-100 text-black"
                                  : darkMode
                                  ? "bg-gray-800 text-white"
                                  : "bg-gray-200 text-black"
                              )}
                            >
                              {text && <p>{text}</p>}

                              {photo && (
                                <img
                                  src={photo}
                                  alt="Sent"
                                  className="mt-2 rounded-md max-w-[200px]"
                                />
                              )}

                              <div className="flex justify-between items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>{time}</span>
                                {isMe && (
                                  <span>
                                    {status === "seen"
                                      ? "✓✓ Seen"
                                      : status === "delivered"
                                      ? "✓✓"
                                      : "✓ Sent"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right avatar */}
                            {isMe && (
                              <img
                                src={avatar}
                                alt={name}
                                className="w-8 h-8 rounded-full border shadow-sm"
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
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
              {/* Image preview when selected */}
              {selectedImage && (
                <div className="mb-3 relative">
                  <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-1 right-1 bg-gray-800/80 text-white rounded-full p-1"
                    >
                      <Icons.x className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <label htmlFor="image-upload">
                  <div
                    className={cn(
                      "p-2 rounded-full cursor-pointer",
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    )}
                  >
                    <ImageIcon className="h-5 w-5" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(URL.createObjectURL(file));
                          setChatImage(file);
                        }
                      }}
                    />
                  </div>
                </label>

                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
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
                  <div className="absolute right-2 top-2 flex space-x-1">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={cn(
                        darkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-600"
                      )}
                    >
                      <Icons.smile className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim() && !selectedImage}
                  className={cn(
                    "p-2 rounded-full",
                    message.trim() || selectedImage
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

              {/* Emoji picker */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-16 right-4 z-50"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={350}
                    previewConfig={{ showPreview: false }}
                    skinTonesDisabled
                    searchDisabled
                    theme={darkMode ? Theme.DARK : Theme.LIGHT}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <ChatNotFound
            darkMode={darkMode}
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
          />
        )}
      </div>

      {/* Right sidebar - Activity/Details - Desktop only */}
      {!isMobile && activeChat && (
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
                <AvatarImage src={activeChat?.photo} />
                <AvatarFallback>{activeChat?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h4 className="font-semibold text-lg">{activeChat?.name}</h4>
              <p
                className={cn(
                  "text-sm",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}
              >
                Online
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
