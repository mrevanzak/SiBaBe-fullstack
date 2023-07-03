use std::vec;

use rspc::RouterBuilder;

use super::{Ctx, Router};

pub(crate) fn route() -> RouterBuilder<Ctx> {
    Router::new()
        .query("get", |t| {
            t(|ctx, _: ()| async move {
                let products = ctx.db.products().find_many(vec![]).exec().await.unwrap();
                Ok(products)
            })
        })
}