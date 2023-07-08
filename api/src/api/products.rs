use rspc::{RouterBuilder, Type};

use crate::prisma;

use super::{Ctx, Router};

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

pub(crate) fn route() -> RouterBuilder<Ctx> {
    Router::new().query("get", |t| {
        t(|ctx, _: ()| async move {
            let products_query = ctx.db.products().find_many(vec![]).exec().await?;
            let mut products: Vec<Product> = Vec::new();
            
            for product in products_query.iter() {
                let product_id = &product.id;
                let reviews_query = ctx.db.feedback()
                    .find_many(vec![prisma::feedback::product::is(vec![prisma::products::id::equals(product_id.to_string())])])
                    .exec()
                    .await?;
                let mut reviews: Vec<Reviews> = Vec::new();

                for review in reviews_query.iter() {
                    let feedback_orders = ctx.db.feedback_orders().find_first(vec![]).exec().await?;
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
}
