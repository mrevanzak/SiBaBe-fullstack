// This file was generated by [rspc](https://github.com/oscartbeaumont/rspc). Do not edit this file manually.

export type Procedures = {
  queries: { key: 'products.get'; input: never; result: Product[] };
  mutations: never;
  subscriptions: never;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
} & { reviews: Reviews[] };

export type Products = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
};

export type Reviews = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  feedback: string;
  rating: number;
  product_id: string;
} & { username: string };

export type Feedback = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  feedback: string;
  rating: number;
  product_id: string;
};
