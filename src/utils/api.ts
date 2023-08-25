// This file was generated by [rspc](https://github.com/oscartbeaumont/rspc). Do not edit this file manually.

export type Procedures = {
    queries: 
        { key: "carts.get", input: never, result: Cart } | 
        { key: "orders.admin.get", input: never, result: OrderWithCart[] } | 
        { key: "orders.get", input: never, result: Orders[] } | 
        { key: "orders.show", input: string, result: OrderWithCart | null } | 
        { key: "products.get", input: never, result: Product[] } | 
        { key: "reports.get", input: never, result: Reports[] } | 
        { key: "users.get", input: never, result: Customers | null },
    mutations: 
        { key: "carts.remove", input: string, result: null } | 
        { key: "carts.update", input: UpdateCartArgs, result: ProductCarts } | 
        { key: "orders.checkout", input: CheckoutArgs, result: Orders } | 
        { key: "orders.confirm", input: ConfirmArgs, result: null } | 
        { key: "orders.payment", input: PaymentConfirmArgs, result: null } | 
        { key: "products.create", input: AddProductArgs, result: Products } | 
        { key: "products.delete", input: string, result: Products } | 
        { key: "products.update", input: UpdateProductArgs, result: Products } | 
        { key: "reviews.create", input: AddReviewArgs, result: null } | 
        { key: "users.add.address", input: AddAddressArgs, result: Customers },
    subscriptions: never
};

export type ConfirmArgs = { id: string; confirm: boolean }

export type OrderStatus = "pending" | "payment" | "validated" | "rejected" | "complete"

export type Products = { id: string; name: string; description: string; price: number; stock: number; image: string; created_at: string | null; updated_at: string | null; deleted_at: string | null }

export type UpdateCartArgs = { product_id: string; quantity: number }

export type OrderWithCart = { id: string; created_at: string | null; updated_at: string | null; deleted_at: string | null; total_product: number; total_price: number; status: OrderStatus; address: string; courier: string; payment_method: PaymentMethod; payment_proof: string | null; validated_by: string | null; cart_id: string; customer_id: string; cart: { product_carts: ({ is_reviewed: boolean; product: Products; quantity: number; total_price: number })[] } }

export type ProductCart = { product_id: string; cart_id: string; quantity: number; total_price: number; is_reviewed: boolean; product: Products }

export type Orders = { id: string; created_at: string | null; updated_at: string | null; deleted_at: string | null; total_product: number; total_price: number; status: OrderStatus; address: string; courier: string; payment_method: PaymentMethod; payment_proof: string | null; validated_by: string | null; cart_id: string; customer_id: string }

export type Feedbacks = { id: string; created_at: string | null; updated_at: string | null; deleted_at: string | null; feedback: string; rating: number; product_id: string }

export type AddAddressArgs = { address: string; phone: string }

export type Reviews = ({ id: string; created_at: string | null; updated_at: string | null; deleted_at: string | null; feedback: string; rating: number; product_id: string }) & { username: string }

export type Product = ({ id: string; name: string; description: string; price: number; stock: number; image: string; created_at: string | null; updated_at: string | null; deleted_at: string | null }) & { reviews: Reviews[] }

export type AddReviewArgs = { feedback: string; rating: number; product_id: string; order_id: string; name: string }

export type UpdateProductArgs = { id: string; name: string; description: string; price: number; stock: number }

export type AddProductArgs = { name: string; description: string; price: number; stock: number; image: string }

export type PaymentMethod = "ITS_BANK" | "COD"

export type Customers = { id: string; created_at: string | null; updated_at: string | null; username: string; name: string; email: string; address: string | null; phone: string | null }

export type Reports = { date: string; income: number; expense: number }

export type Cart = { id: string; total_price: number; product_carts: ProductCart[] }

export type ProductCarts = { product_id: string; cart_id: string; quantity: number; total_price: number; is_reviewed: boolean }

export type CheckoutArgs = { courier: string; address: string; payment_method: PaymentMethod }

export type PaymentConfirmArgs = { id: string; payment_proof: string }
