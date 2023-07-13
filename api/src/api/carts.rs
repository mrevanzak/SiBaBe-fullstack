use prisma_client_rust::{ and, Direction };
use rspc::{ Error, ErrorCode, Type, RouterBuilder };
use serde::{ Deserialize, Serialize };

use crate::prisma::{ self, CartStatus };

use super::{ PrivateCtx, PrivateRouter };

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
struct ProductCart {
  #[serde(flatten)]
  data: prisma::product_carts::Data,
  product: prisma::products::Data,
}

#[derive(Debug, Serialize, Deserialize, Type)]
struct CartResponse {
  id: String,
  total_price: i32,
  product_carts: Vec<ProductCart>,
}

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new()
    .query("get", |t| {
      t(|ctx: PrivateCtx, _: ()| async move {
        ctx.role.admin_unauthorized()?;

        let get_cart_query = ctx.db
          .carts()
          .find_first(
            vec![
              prisma::carts::customer_id::equals(ctx.user_id.to_string()),
              and!(prisma::carts::status::equals(CartStatus::Idle))
            ]
          )
          .select(
            prisma::carts::select!({
              //prettier-ignore
              id
              total_price
            })
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Keranjang tidak ditemukan".to_string(),
              err
            )
          })?;

        let cart_id = match &get_cart_query {
          Some(cart) => String::from(&cart.id),
          None => {
            let create_cart_query = ctx.db
              .carts()
              .create(prisma::customers::id::equals(ctx.user_id.to_string()), vec![])
              .exec().await
              .map_err(|err| {
                Error::with_cause(
                  ErrorCode::InternalServerError,
                  "Gagal membuat keranjang".to_string(),
                  err
                )
              })?;

            create_cart_query.id
          }
        };

        let product_cart_query = ctx.db
          .product_carts()
          .find_many(vec![prisma::product_carts::cart_id::equals(String::from(&cart_id))])
          .order_by(prisma::product_carts::product_id::order(Direction::Asc))
          .with(prisma::product_carts::product::fetch())
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal mendapatkan produk di keranjang".to_string(),
              err
            )
          })?;

        Ok(CartResponse {
          id: cart_id,
          total_price: get_cart_query.unwrap().total_price,
          product_carts: product_cart_query
            .into_iter()
            .map(|product_cart| ProductCart {
              data: product_cart.clone(),
              product: product_cart.product().unwrap().clone(),
            })
            .collect(),
        })
      })
    })
    .mutation("add", |t| {
      t(|ctx: PrivateCtx, product_id: String| async move {
        ctx.role.admin_unauthorized()?;

        let get_product_query = ctx.db
          .products()
          .find_first(vec![prisma::products::id::equals(product_id.to_string())])
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Produk tidak ditemukan".to_string(),
              err
            )
          })?;
        let product = get_product_query.unwrap();

        let get_cart_query = ctx.db
          .carts()
          .find_first(
            vec![
              prisma::carts::customer_id::equals(ctx.user_id.to_string()),
              and!(prisma::carts::status::equals(CartStatus::Idle))
            ]
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Keranjang tidak ditemukan".to_string(),
              err
            )
          })?;

        let cart_id = match get_cart_query {
          Some(cart) => cart.id,
          None => {
            let create_cart_query = ctx.db
              .carts()
              .create(prisma::customers::id::equals(ctx.user_id.to_string()), vec![])
              .exec().await
              .map_err(|err| {
                Error::with_cause(
                  ErrorCode::InternalServerError,
                  "Gagal membuat keranjang".to_string(),
                  err
                )
              })?;

            create_cart_query.id
          }
        };

        let _product_cart_query = ctx.db
          .product_carts()
          .upsert(
            prisma::product_carts::product_id_cart_id(product_id.clone(), cart_id.clone()),
            prisma::product_carts::create(
              1,
              product.price,
              prisma::products::id::equals(product_id.to_string()),
              prisma::carts::id::equals(cart_id.to_string()),
              vec![]
            ),
            vec![
              prisma::product_carts::quantity::increment(1),
              prisma::product_carts::total_price::increment(product.price)
            ]
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal menambahkan produk ke keranjang".to_string(),
              err
            )
          })?;

        let update_cart_query = ctx.db
          .carts()
          .update(
            prisma::carts::id::equals(cart_id),
            vec![prisma::carts::total_price::increment(product.price)]
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal update harga total keranjang".to_string(),
              err
            )
          })?;

        Ok(update_cart_query)
      })
    })
}
