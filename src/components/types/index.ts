export type Review = {
  id: string;
  name: string;
  description: string;
  rating: number;
};

export type Product = {
  name: string;
  price: number;
  description: string;
  image: string;
  reviews: Review[];
};
