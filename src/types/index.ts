export type ListOfObject<T> = {
  [key: string]: T;
};

export type Review = {
  feedback: string;
  rating: number;
  username: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
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

export type UserData = {
  username: string;
  password: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
};

export type User = {
  data?: UserData;
  username: string;
  name: string;
  token: string;
};

export type OrderData = {
  invoice: string;
  id: number;
  createdAt: string;
  cartId: number;
  customerUsername: string;
  totalQty: number;
  totalPrice: number;
  status: string;
  address: string;
  courier: string;
  proofOfPayment: string;
  validationBy: string;
};

export type History = {
  order: OrderData[];
};

export type HistoryDetail = {
  invoice: string;
  orderID: number;
  cartID: number;
  status: string;
  address: string;
  courier: string;
  product: ProductElement[];
};

export type ProductElement = {
  quantity: number;
  totalPrice: number;
  product: ProductProduct;
};

export type ProductProduct = {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
};

export type ApiResponseType = {
  message: string;
  errors: string;
  data: object;
};
