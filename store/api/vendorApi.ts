import { baseApi } from "./baseApi";

export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllVendors: builder.query({
            query: (params) => ({
                url: "vendor/all-vendors",
                method: "GET",
                params,
            }),
            providesTags: ["vendor"],
        }),
        deleteVendor: builder.mutation({
            query: (id) => ({
                url: `vendor/delete-vendor/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["vendor"],
        }),
        createVendor: builder.mutation({
            query: (formData) => ({
                url: "vendor/create-vendor",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["vendor"],
        }),
    }),
});

export const {
    useGetAllVendorsQuery,
    useDeleteVendorMutation,
    useCreateVendorMutation,
} = vendorApi;

export default vendorApi;
