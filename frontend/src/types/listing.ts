
export interface ListingDetailsResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  priceType: string;
  status: string;
}

export interface ListingsListApiResponse {
  success: boolean;
  data: ListingDetailsResponse[];
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'monthly';
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {
  status?: string;
}