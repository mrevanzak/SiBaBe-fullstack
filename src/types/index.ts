export type ListOfObject<T> = {
  [key: string]: T;
};

export type Review = {
  id: string;
  name: string;
  description: string;
  rating: number;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stok: number;
  reviews: Review[];
};

export type Cart = {
  cartId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  product: Product;
};

export type UserCart = {
  id: string;
  username: string;
  totalQty: number;
  product: Cart[];
  totalPrice: number;
};

export type User = {
  username: string;
  nama: string;
  token: string;
};
