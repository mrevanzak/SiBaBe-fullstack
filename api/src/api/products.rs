use prisma_client_rust::chrono::{ DateTime, FixedOffset, Utc };
use rspc::{ RouterBuilder, Type, Error, ErrorCode };
use serde::{ Serialize, Deserialize };

use crate::prisma;

use super::{ Ctx, PublicRouter, AdminRouter, AdminCtx };

pub(crate) fn public_route() -> RouterBuilder<Ctx> {
  prisma::products::include!(Product {
    feedback: select {
      feedback
      rating
      feedback_orders: select {
        username
      }
    }
  });

  PublicRouter::new().query("get", |t| {
    t(|ctx, _: ()| async move {
      let products_query = ctx.db
        .products()
        .find_many(vec![prisma::products::deleted_at::equals(None)])
        .include(Product::include())
        .exec().await?;

      Ok(products_query)
    })
  })
}

pub(crate) fn admin_route() -> RouterBuilder<AdminCtx> {
  AdminRouter::new()
    .mutation("create", |t| {
      #[derive(Debug, Serialize, Deserialize, Type)]
      struct AddProductArgs {
        name: String,
        description: String,
        price: i32,
        stock: i32,
        image: String,
      }

      t(|ctx, input: AddProductArgs| async move {
        let create_product = ctx.db
          .products()
          .create(input.name, input.description, input.price, input.stock, input.image, vec![])
          .exec().await
          .map_err(|e| {
            Error::with_cause(ErrorCode::InternalServerError, "Gagal membuat produk".to_string(), e)
          })?;
        Ok(create_product)
      })
    })
    .mutation("update", |t| {
      #[derive(Debug, Serialize, Deserialize, Type)]
      struct UpdateProductArgs {
        id: String,
        name: String,
        description: String,
        price: i32,
        stock: i32,
      }

      t(|ctx, input: UpdateProductArgs| async move {
        let update_product = ctx.db
          .products()
          .update(
            prisma::products::id::equals(input.id),
            vec![
              prisma::products::name::set(input.name),
              prisma::products::description::set(input.description),
              prisma::products::price::set(input.price),
              prisma::products::stock::set(input.stock)
            ]
          )
          .exec().await?;
        Ok(update_product)
      })
    })
    .mutation("delete", |t| {
      t(|ctx, id: String| async move {
        let delete_product = ctx.db
          .products()
          .update(
            prisma::products::id::equals(id),
            vec![prisma::products::deleted_at::set(Some(DateTime::<FixedOffset>::from(Utc::now())))]
          )
          .exec().await?;
        Ok(delete_product)
      })
    })
}
