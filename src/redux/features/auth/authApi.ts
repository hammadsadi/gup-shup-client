import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // register
    register: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        body: data,
      }),
    }),
    //  login
    login: builder.mutation({
      query: (data) => ({
        url: "/user/login",
        method: "POST",
        body: data,
      }),
    }),
    // Verify OTP
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/user/verify-account",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    // Get me
    getCurrentUser: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useGetCurrentUserQuery,
} = authApi;
