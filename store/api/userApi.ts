import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (params) => ({
        url: "user/all-users",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["user"],
    }),
    changeStatus: builder.mutation({
      query: (data) => ({
        url: `auth/change_status/${data?.id}`,
        method: "PATCH",
        body: data.status,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `auth/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `user/get_single_user/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "user/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

// asdf

export const {
  useGetAllUserQuery,
  useChangeStatusMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useLazyGetSingleUserQuery,
  useUpdateProfileMutation,
} = userApi;
