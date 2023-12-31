use prisma_client_rust::{ and, Direction };
use rspc::{ Error, ErrorCode, Type, RouterBuilder };
use serde::{ Deserialize, Serialize };

use crate::prisma::{ self, CartStatus };

use super::{ PrivateCtx, PrivateRouter };

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new()
    .query("get", |t| {
      prisma::product_carts::include!(ProductCart { product });

      #[derive(Debug, Serialize, Deserialize, Type)]
      struct Cart {
        id: String,
        total_price: i32,
        product_carts: Vec<ProductCart::Data>,
      }

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
          .include(ProductCart::include())
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal mendapatkan produk di keranjang".to_string(),
              err
            )
          })?;

        Ok(Cart {
          id: cart_id,
          total_price: get_cart_query.unwrap().total_price,
          product_carts: product_cart_query,
        })
      })
    })
    .mutation("update", |t| {
      #[derive(Debug, Serialize, Deserialize, Type)]
      struct UpdateCartArgs {
        product_id: String,
        quantity: i32,
      }

      t(|ctx: PrivateCtx, input: UpdateCartArgs| async move {
        ctx.role.admin_unauthorized()?;

        let get_product_query = ctx.db
          .products()
          .find_first(vec![prisma::products::id::equals(input.product_id.to_string())])
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
          .upsert(
            prisma::product_carts::product_id_cart_id(input.product_id.clone(), cart_id.clone()),
            prisma::product_carts::create(
              input.quantity,
              product.price,
              prisma::products::id::equals(input.product_id.to_string()),
              prisma::carts::id::equals(cart_id.to_string()),
              vec![]
            ),
            vec![
              prisma::product_carts::quantity::increment(input.quantity),
              prisma::product_carts::total_price::increment(input.quantity * product.price)
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

        if product_cart_query.quantity == 0 {
          let _delete_product_cart_query = ctx.db
            .product_carts()
            .delete(prisma::product_carts::product_id_cart_id(input.product_id, cart_id.clone()))
            .exec().await
            .map_err(|err| {
              Error::with_cause(
                ErrorCode::InternalServerError,
                "Gagal menghapus produk dari keranjang".to_string(),
                err
              )
            })?;
        }

        let _update_cart_query = ctx.db
          .carts()
          .update(
            prisma::carts::id::equals(cart_id),
            vec![prisma::carts::total_price::increment(input.quantity * product.price)]
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal update harga total keranjang".to_string(),
              err
            )
          })?;

        Ok(product_cart_query)
      })
    })
    .mutation("remove", |t| {
      t(|ctx: PrivateCtx, product_id: String| async move {
        ctx.role.admin_unauthorized()?;

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
        let cart_id = get_cart_query.unwrap().id;

        let delete_product_cart_query = ctx.db
          .product_carts()
          .delete(prisma::product_carts::product_id_cart_id(product_id, cart_id.clone()))
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal menghapus produk dari keranjang".to_string(),
              err
            )
          })?;

        let _update_cart_query = ctx.db
          .carts()
          .update(
            prisma::carts::id::equals(cart_id),
            vec![prisma::carts::total_price::decrement(delete_product_cart_query.total_price)]
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal update harga total keranjang".to_string(),
              err
            )
          })?;

        Ok(())
      })
    })
}
