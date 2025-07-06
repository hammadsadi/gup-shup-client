import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // register
    // register: builder.mutation({
    //   query: (data) => ({
    //     url: "/user/register",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),

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

export const { useGetUserListQuery } = authApi;
