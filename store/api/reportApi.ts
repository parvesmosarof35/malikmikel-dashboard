import { baseApi } from "./baseApi";

export const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all reports
        getAllReports: builder.query({
            query: (params) => ({
                url: "report/all-reports",
                method: "GET",
                params,
            }),
            providesTags: ["report"],
        }),

        // Delete report
        deleteReport: builder.mutation({
            query: (id) => ({
                url: `report/delete-report/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["report"],
        }),
    }),
});

export const {
    useGetAllReportsQuery,
    useDeleteReportMutation,
} = reportApi;

export default reportApi;
