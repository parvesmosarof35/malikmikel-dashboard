import { baseApi } from "./baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaq: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => {
        const page = (params as any)?.page ?? 1;
        const limit = (params as any)?.limit ?? 10;
        return {
          url: `faq/get-all-faqs?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["faq"],
    }),

    createFaq: builder.mutation({
      query: (data) => ({
        url: "faq/create-faq",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["faq"],
    }),

    updateFaq: builder.mutation({
      query: ({ _id, data }) => ({
        url: `faq/update-faq/${_id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["faq"],
    }),

    deleteFaq: builder.mutation({
      query: (_id) => ({
        url: `faq/delete-faq/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faq"],
    }),
  }),
});

export const {
  useGetAllFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;

export default faqApi;