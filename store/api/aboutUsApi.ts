import { baseApi } from "./baseApi";

const aboutUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAboutUs: builder.query({
      query: () => ({
        url: "legalDoc/create-doc/aboutUs",
        method: "GET",
      }),
      providesTags: ["aboutUs"],
    }),
    updateAboutUs: builder.mutation({
      query: (data) => ({
        url: "legalDoc/create-doc/aboutUs",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["aboutUs"],
    }),
  }),
});

export const { useGetAboutUsQuery, useUpdateAboutUsMutation } = aboutUsApi;