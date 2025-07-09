// export type TUserList = {
//   email: string;
//   id: string;
//   isAccountActive: boolean;
//   name: string;
//   phone: string;
//   photo: string;
//   bio: string;
// };
export type TMessage = {
  id: string;
  text: string | null;
  photo: string | null;
  emoji?: string | null;
  link?: string | null;
  createdAt: string;
};

export type TChatSender = {
  id: string;
  name: string;
  photo: string;
  username: string;
};

export type TChatItem = {
  id: string;
  createdAt: string;
  message: TMessage;
  sender: TChatSender;
};

export type TUserList = {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  photo: string;
  isAccountActive: boolean;
  sentChats: TChatItem[];
  receivedChats: TChatItem[];
};

// User model (sender/receiver)
export interface IUser {
  id: string;
  name: string;
  email: string;
  photo: string;
}

// Chat model
export interface IChat {
  id: string;
  senderId: string;
  receiverId: string;
  messageId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  status: "sent" | "delivered" | "seen";
  theme: string | null;

  // Relations
  message: TMessage;
  sender: IUser;
  receiver: IUser;
}
export type TChatList = IChat[];
export interface ISocketUser {
  socketId: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    photo: string;
    accessToken: string;
    isAccountActive: boolean;
  };
}
