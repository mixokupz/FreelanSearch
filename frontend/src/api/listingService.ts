
import { request } from './apiClient';
import { ListingsListApiResponse } from '../types/listing';

export const listingService = {
  // GET /api/v1/listings
  getListings: async (): Promise<ListingsListApiResponse> => {
    return request<ListingsListApiResponse>('/listings', {
      method: 'GET',
    });
  },
};