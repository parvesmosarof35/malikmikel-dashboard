import { baseApi } from "./baseApi";

export const subCategoryApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllSubCategories: build.query({
            query: ({ page = 1, limit = 10, category = "", searchTerm = "" }: { page?: number; limit?: number; category?: string; searchTerm?: string } = {}) => {
                let url = `sub-cetagory/all-sub-cetagory?page=${page}&limit=${limit}`;
                if (category) url += `&category=${category}`;
                if (searchTerm) url += `&searchTerm=${searchTerm}`;
                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["subCategory"],
        }),
        createSubCategory: build.mutation({
            query: (formData: FormData) => ({
                url: "sub-cetagory/create-sub-cetagory",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["subCategory"],
        }),
        updateSubCategory: build.mutation({
            query: ({ id, data }: { id: string; data: FormData }) => ({
                url: `sub-cetagory/update-sub-cetagory/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["subCategory"],
        }),
        deleteSubCategory: build.mutation({
            query: (id: string) => ({
                url: `sub-cetagory/delete-sub-cetagory/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["subCategory"],
        }),
    }),
});

export const {
    useGetAllSubCategoriesQuery,
    useCreateSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
} = subCategoryApi;
