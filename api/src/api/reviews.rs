use rspc::{ RouterBuilder, Error, ErrorCode, Type };
use serde::{ Serialize, Deserialize };

use crate::prisma;

use super::{ PrivateCtx, PrivateRouter };

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new().mutation("create", |t| {
    #[derive(Serialize, Deserialize, Type)]
    struct AddReviewArgs {
      feedback: String,
      rating: i32,
      product_id: String,
      order_id: String,
      name: String,
    }

    t(|ctx: PrivateCtx, input: AddReviewArgs| async move {
      ctx.role.admin_unauthorized()?;

      let create_review_query = ctx.db
        .feedbacks()
        .create(
          input.feedback,
          input.rating,
          prisma::products::id::equals(input.product_id.clone()),
          vec![]
        )
        .exec().await
        .map_err(|err| {
          Error::with_cause(ErrorCode::InternalServerError, "Gagal membuat review".to_string(), err)
        })?;

      let _create_feedback_order_query = ctx.db
        .feedback_orders()
        .create(
          input.name,
          prisma::orders::id::equals(input.order_id.clone()),
          prisma::feedbacks::id::equals(create_review_query.id),
          vec![]
        )
        .exec().await
        .map_err(|err| {
          Error::with_cause(ErrorCode::InternalServerError, "Gagal membuat review".to_string(), err)
        })?;

      let get_order_query = ctx.db
        .orders()
        .find_first(vec![prisma::orders::id::equals(input.order_id)])
        .select(prisma::orders::select!({ cart_id }))
        .exec().await
        .map_err(|err| {
          Error::with_cause(ErrorCode::InternalServerError, "Gagal membuat review".to_string(), err)
        })?;

      let _update_product_cart_query = ctx.db
        .product_carts()
        .update(
          prisma::product_carts::product_id_cart_id(
            input.product_id,
            get_order_query.unwrap().cart_id
          ),
          vec![prisma::product_carts::is_reviewed::set(true)]
        )
        .exec().await
        .map_err(|err| {
          Error::with_cause(ErrorCode::InternalServerError, "Gagal membuat review".to_string(), err)
        })?;

      Ok(())
    })
  })
}
