import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create user
        createAdmin: builder.mutation({
            query: (userData) => ({
                url: "user/create_user",
                method: "POST",
                body: userData, // expects JSON
            }),
            invalidatesTags: ["admin", "dashboard"],
        }),
        // Admin login
        adminLogin: builder.mutation({
            query: (credentials) => ({
                url: "admin/admin-login",
                method: "POST",
                body: credentials,
            }),
        }),
        // Forgot Password Admin
        forgotPasswordAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/forgot-password",
                method: "POST",
                body: data,
            }),
        }),
        // Verify OTP Admin
        verifyOtpAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/otp-verify",
                method: "POST",
                body: data,
            }),
        }),
        // Reset Password Admin
        resetPasswordAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/reset-password",
                method: "POST",
                body: data,
            }),
        }),
        // Get single admin
        getSingleAdmin: builder.query({
            query: (id) => `admin/single-admin/${id}`,
            providesTags: ["admin"],
        }),
        // Update admin
        updateAdmin: builder.mutation({
            query: (data) => ({
                url: `admin/update-admin-personal-info`,
                method: "PATCH",
                body: data, // FormData for image upload
            }),
            invalidatesTags: ["admin"],
        }),
        // Change password admin
        changePasswordAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/change-password",
                method: "PUT",
                body: data,
            }),
        }),
        // Get all admins with pagination
        getAllAdmins: builder.query({
            query: ({ limit = 10, page = 1 }: any = {}) =>
                `auth/find_by_all_admin?limit=${limit}&page=${page}`,
            providesTags: ["admin"],
        }),
        // Delete admin
        deleteAdmin: builder.mutation({
            query: (id) => ({
                url: `user/delete_user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["admin", "dashboard"],
        }),
        // Get all consultants
        getAllConsultants: builder.query({
            query: ({ limit = 10, page = 1 }: any = {}) =>
                `user/getallconsult?limit=${limit}&page=${page}`,
            providesTags: ["admin"],
        }),
        // Get all bookings
        getAllBookings: builder.query({
            query: ({ page = 1, limit = 10, consultantid = "", status = "" }: any = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page.toString());
                if (limit) params.append("limit", limit.toString());
                if (consultantid) params.append("consultantid", consultantid);
                if (status) params.append("status", status);
                return `bookings/get_all_booked_data_for_admin?${params.toString()}`;
            },
            providesTags: ["admin"],
        }),
    }),
});
export const {
    useCreateAdminMutation,
    useAdminLoginMutation,
    useForgotPasswordAdminMutation,
    useVerifyOtpAdminMutation,
    useResetPasswordAdminMutation,
    useGetSingleAdminQuery,
    useUpdateAdminMutation,
    useChangePasswordAdminMutation,
    useGetAllAdminsQuery,
    useDeleteAdminMutation,
    useGetAllConsultantsQuery,
    useGetAllBookingsQuery,
} = adminApi;

export default adminApi;