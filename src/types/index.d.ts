export type TUserList = {
  email: string;
  id: string;
  isAccountActive: boolean;
  name: string;
  phone: string;
  photo: string;
  bio: string;
};
// Message model
export interface IMessage {
  id: string;
  text: string | null;
  photo: string | null;
  emoji: string | null;
  link: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  message: IMessage;
  sender: IUser;
  receiver: IUser;
}
export type TChatList = IChat[];
