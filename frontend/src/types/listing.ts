
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