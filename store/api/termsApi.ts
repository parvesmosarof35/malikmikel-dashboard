import { baseApi } from "./baseApi";

const termsAndConditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsAndConditions: builder.query({
      query: () => ({
        url: "legalDoc/get-doc/termsAndCondition",
        method: "GET",
      }),
      providesTags: ["termsAndConditions"],
    }),
    updateTermsAndConditions: builder.mutation({
      query: (data) => ({
        url: "legalDoc/create-doc/termsAndCondition",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["termsAndConditions"],
    }),
  }),
});

export const {
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
} = termsAndConditionsApi;