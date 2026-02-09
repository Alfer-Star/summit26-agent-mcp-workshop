export interface CheckoutProductDto {
  products: {
    productId: string;
    quantity: number;
  }[];
}
