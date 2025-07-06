import { baseApi } from "@/redux/api/baseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Chat API
    createChat: builder.mutation({
      query: (data) => ({
        url: "/chat/create",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Get Chats
    getAllChats: builder.query({
      query: (receiverId) => ({
        url: `/chat/${receiverId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useCreateChatMutation, useGetAllChatsQuery } = chatApi;
