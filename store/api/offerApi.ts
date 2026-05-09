import { baseApi } from "./baseApi";

export const offerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create Offer
        createOffer: builder.mutation({
            query: (data) => ({
                url: "offer/create-offer",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Offer"],
        }),
        // Get All Offers
        getAllOffers: builder.query({
            query: ({ searchTerm = "" }: { searchTerm?: string } = {}) => {
                let url = "offer/all-offers";
                if (searchTerm) url += `?searchTerm=${searchTerm}`;
                return url;
            },
            providesTags: ["Offer"],
        }),
        // Get Single Offer by ID
        getOfferById: builder.query({
            query: (id) => `offer/single-offer/${id}`,
            providesTags: (result, error, id) => [{ type: "Offer", id }],
        }),
        // Update Offer
        updateOffer: builder.mutation({
            query: ({ id, data }) => ({
                url: `offer/update-offer/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Offer"],
        }),
        // Delete Offer
        deleteOffer: builder.mutation({
            query: (id) => ({
                url: `offer/delete-offer/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Offer"],
        }),
    }),
});

export const {
    useCreateOfferMutation,
    useGetAllOffersQuery,
    useGetOfferByIdQuery,
    useUpdateOfferMutation,
    useDeleteOfferMutation,
} = offerApi;

export default offerApi;
