
import { request } from './apiClient';
import { ListingsListApiResponse, CreateListingRequest, UpdateListingRequest, ListingDetailsResponse } from '../types/listing';

export const listingService = {
  // GET /api/v1/listings
  getListings: async (): Promise<ListingsListApiResponse> => {
    return request<ListingsListApiResponse>('/listings', {
      method: 'GET',
    });
  },

  // GET /api/v1/listings/user/{userId}
  getListingsByUser: async (userId: number): Promise<ListingsListApiResponse> => {
    return request<ListingsListApiResponse>(`/listings/user/${userId}`, {
      method: 'GET',
    });
  },

  // POST /api/v1/listings
  createListing: async (data: CreateListingRequest): Promise<{ success: boolean, data: ListingDetailsResponse }> => {
    return request<{ success: boolean, data: ListingDetailsResponse }>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/v1/listings/{id}
  updateListing: async (id: number, data: UpdateListingRequest): Promise<{ success: boolean, data: ListingDetailsResponse }> => {
    return request<{ success: boolean, data: ListingDetailsResponse }>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/v1/listings/{id}
  deleteListing: async (id: number): Promise<{ success: boolean, data: { message: string } }> => {
    return request<{ success: boolean, data: { message: string } }>(`/listings/${id}`, {
      method: 'DELETE',
    });
  },
};