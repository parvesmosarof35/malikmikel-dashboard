import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: (arg: Record<string, any>) => ({
        url: "review/all-rettings",
        method: "GET",
        params: arg,
      }),
      providesTags: ["reviews"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `review/delete-retting/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const { useGetAllReviewsQuery, useDeleteReviewMutation } = reviewApi;
