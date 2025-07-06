import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // register
    updateUserInfo: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
    }),

    // Get me
    getUserList: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetUserListQuery, useUpdateUserInfoMutation } = authApi;
