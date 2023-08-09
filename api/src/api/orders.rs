use prisma_client_rust::and;
use rspc::{ RouterBuilder, Error, ErrorCode, Type };
use serde::{ Serialize, Deserialize };

use crate::prisma::{ self, CartStatus, PaymentMethod };

use super::{ PrivateCtx, PrivateRouter };

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new()
    .mutation("checkout", |t| {
      #[derive(Serialize, Deserialize, Type)]
      struct Checkout {
        courier: String,
        address: String,
        payment_method: PaymentMethod,
      }

      t(|ctx: PrivateCtx, input: Checkout| async move {
        ctx.role.admin_unauthorized()?;

        let get_product_cart_query = ctx.db
          .product_carts()
          .find_many(
            vec![
              prisma::product_carts::cart::is(
                vec![
                  prisma::carts::customer_id::equals(ctx.user_id.to_string()),
                  and!(prisma::carts::status::equals(CartStatus::Idle))
                ]
              )
            ]
          )
          .with(prisma::product_carts::cart::fetch())
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Keranjang tidak ditemukan".to_string(),
              err
            )
          })?;

        let cart = get_product_cart_query[0].cart.clone().unwrap();

        let create_order_query = ctx.db
          .orders()
          .create(
            get_product_cart_query.len() as i32,
            cart.total_price,
            input.address,
            input.courier,
            input.payment_method,
            prisma::carts::id::equals(cart.clone().id),
            prisma::customers::id::equals(ctx.user_id.to_string()),
            vec![]
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal membuat order".to_string(),
              err
            )
          })?;

        let _update_cart_query = ctx.db
          .carts()
          .update(
            prisma::carts::id::equals(cart.id),
            vec![prisma::carts::status::set(CartStatus::Checkout)]
          )
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal mengupdate keranjang".to_string(),
              err
            )
          })?;

        Ok(create_order_query)
      })
    })
    .query("get", |t| {
      t(|ctx: PrivateCtx, _: ()| async move {
        ctx.role.admin_unauthorized()?;

        let get_orders_query = ctx.db
          .orders()
          .find_many(vec![prisma::orders::customer_id::equals(ctx.user_id.to_string())])
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal mengambil order".to_string(),
              err
            )
          })?;

        Ok(get_orders_query)
      })
    })
    .query("show", |t| {
      prisma::orders::include!(OrderWithCart {
        cart: select{
          product_carts: select{
            product
            quantity
            total_price
          }
        }
      });

      t(|ctx: PrivateCtx, order_id: String| async move {
        ctx.role.admin_unauthorized()?;

        let get_order_query = ctx.db
          .orders()
          .find_first(vec![prisma::orders::id::equals(order_id)])
          .include(OrderWithCart::include())
          .exec().await
          .map_err(|err| {
            Error::with_cause(
              ErrorCode::InternalServerError,
              "Gagal mengambil order".to_string(),
              err
            )
          })?;

        Ok(get_order_query)
      })
    })
}
