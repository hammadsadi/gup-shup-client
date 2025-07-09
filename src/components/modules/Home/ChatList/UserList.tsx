import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useGetUserListQuery } from "@/redux/features/user/userApi";
import type { ISocketUser, TUserList } from "@/types";
import React, { type RefObject } from "react";
import { formatDistanceToNow } from "date-fns";

const UserList = ({
  activeChat,
  setActiveChat,
  handleChatSelect,
  scrollChats,
  socketActiveUsers,
}: {
  activeChat: TUserList | null;
  setActiveChat: React.Dispatch<React.SetStateAction<TUserList | null>>;
  handleChatSelect: () => void;
  scrollChats: RefObject<HTMLDivElement | null>;
  socketActiveUsers: ISocketUser[] | null;
}) => {
  const { data } = useGetUserListQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const handleScroll = (item: TUserList) => {
    handleChatSelect();
    setActiveChat(item);
    scrollChats.current?.scrollTo({
      top: scrollChats.current.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className="space-y-1">
      {data?.data?.map((user: TUserList) => {
        // activeUserList
        const isActive = socketActiveUsers?.some(
          (activeUser) => activeUser.user.id === user.id
        );
        const sent = user.sentChats?.[0];
        const received = user.receivedChats?.[0];

        const lastChat =
          sent && received
            ? new Date(sent.createdAt) > new Date(received.createdAt)
              ? sent
              : received
            : sent || received || null;

        const messageText = lastChat?.message?.text
          ? lastChat.message.text
          : lastChat?.message?.photo
          ? "📷 Photo"
          : "No messages yet";

        const messageTime = lastChat
          ? formatDistanceToNow(new Date(lastChat.createdAt), {
              addSuffix: true,
            })
          : "";

        return (
          <div
            key={user.id}
            onClick={() => handleScroll(user)}
            className={cn(
              "flex items-center p-3 border-b cursor-pointer hover:bg-opacity-50 border-gray-200 hover:bg-gray-100",
              activeChat?.id === user.id && "bg-gray-100"
            )}
          >
            <div className="relative mr-3">
              <Avatar>
                <AvatarImage src={user.photo} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* active status  */}
              <div
                className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                  isActive ? "bg-green-500" : "bg-gray-300"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium truncate">{user.name}</h3>
                <span className="text-xs text-gray-500">{messageTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm truncate text-gray-600">{messageText}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
