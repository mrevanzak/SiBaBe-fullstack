use prisma_client_rust::and;
use rspc::{ Error, ErrorCode, RouterBuilder };

use crate::{ prisma::{ self, CartStatus }, utils::get_user };

use super::{ Ctx, Router, users::Role };

pub(crate) fn route() -> RouterBuilder<Ctx> {
  Router::new().mutation("add", |t| {
    t(|ctx, product_id: String| async move {
      let user_id = match get_user(ctx.cookies) {
        Role::Admin(id) => id,
        Role::Customer(id) => id,
        Role::None => {
          return Err(Error::new(ErrorCode::Unauthorized, "Unauthorized".to_string()));
        }
      };
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
            prisma::carts::customer_id::equals(user_id.to_string()),
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
            .create(prisma::customers::id::equals(user_id.to_string()), vec![])
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
          prisma::product_carts::create(product_id, cart_id.clone(), 1, product.price, vec![]),
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
