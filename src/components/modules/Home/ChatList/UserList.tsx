import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useGetUserListQuery } from "@/redux/features/user/userApi";
import type { TUserList } from "@/types";
import React, { type RefObject } from "react";

const UserList = ({
  activeChat,
  setActiveChat,
  handleChatSelect,
  scrollChats,
}: {
  activeChat: TUserList | null;
  setActiveChat: React.Dispatch<React.SetStateAction<TUserList | null>>;
  handleChatSelect: () => void;
  scrollChats: RefObject<HTMLDivElement | null>;
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
      {data?.data?.map((user: TUserList) => (
        <div
          key={user.id}
          onClick={() => handleScroll(user)}
          className={cn(
            "flex items-center p-3 border-b cursor-pointer hover:bg-opacity-50 border-gray-200 hover:bg-gray-100 ",
            activeChat?.id === user?.id && "bg-gray-100"
          )}
        >
          <div className="relative mr-3">
            <Avatar>
              <AvatarImage src={user?.photo} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div
              className={cn(
                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-medium truncate">{user?.name}</h3>
              <span className={cn("text-xs text-gray-500")}>Monday</span>
            </div>
            <div className="flex justify-between items-center">
              <p className={cn("text-sm truncate text-gray-600")}>Hello</p>
              {/* {chat.unread > 0 && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                  )}
                >
                  {chat.unread}
                </span>
              )} */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
