use rspc::{ RouterBuilder, Type, Error, ErrorCode };

use crate::prisma;

use super::{ Ctx, Router };

#[derive(Debug, serde::Serialize, serde::Deserialize, Type)]
struct Reviews {
  #[serde(flatten)]
  data: prisma::feedback::Data,
  username: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Type)]
struct Product {
  #[serde(flatten)]
  data: prisma::products::Data,
  reviews: Vec<Reviews>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize, Type)]
struct EditProduct {
  id: String,
  name: String,
  description: String,
  price: i32,
  stock: i32,
}

pub(crate) fn route() -> RouterBuilder<Ctx> {
  Router::new()
    .query("get", |t| {
      t(|ctx, _: ()| async move {
        let products_query = ctx.db
          .products()
          .find_many(vec![])
          .exec().await?;
        let mut products: Vec<Product> = Vec::new();

        for product in products_query.iter() {
          let product_id = &product.id;
          let reviews_query = ctx.db
            .feedback()
            .find_many(
              vec![
                prisma::feedback::product::is(
                  vec![prisma::products::id::equals(product_id.to_string())]
                )
              ]
            )
            .exec().await?;
          let mut reviews: Vec<Reviews> = Vec::new();

          for review in reviews_query.iter() {
            let feedback_orders = ctx.db
              .feedback_orders()
              .find_first(vec![])
              .exec().await?;
            let username = feedback_orders.unwrap().username;

            reviews.push(Reviews {
              data: review.clone(),
              username,
            });
          }
          products.push(Product {
            data: product.clone(),
            reviews,
          });
        }

        Ok(products)
      })
    })
    .mutation("create", |t| {
      t(|ctx, input: prisma::products::Data| async move {
        let create_product = ctx.db
          .products()
          .create(input.name, input.description, input.price, input.stock, input.image, vec![])
          .exec().await
          .map_err(|e| { Error::new(ErrorCode::InternalServerError, e.to_string()) })?;
        Ok(create_product)
      })
    })
    .mutation("edit", |t| {
      t(|ctx, input: EditProduct| async move {
        let edit_product = ctx.db
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
        Ok(edit_product)
      })
    })
    .mutation("delete", |t| {
      t(|ctx, id: String| async move {
        let delete_product = ctx.db
          .products()
          .delete(prisma::products::id::equals(id))
          .exec().await?;
        Ok(delete_product)
      })
    })
}
