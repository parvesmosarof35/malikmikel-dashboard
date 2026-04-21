import { baseApi } from "./baseApi";

const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => ({
        url: "legalDoc/create-doc/privacyPolicy",
        method: "GET",
      }),
      providesTags: ["privacy"],
    }),
    updatePrivacy: builder.mutation({
      query: (data) => ({
        url: "legalDoc/create-doc/privacyPolicy",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["privacy"],
    }),
  }),
});

export const { useGetPrivacyQuery, useUpdatePrivacyMutation } = privacyApi;
