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
            let _products = ctx.db.products().find_many(vec![]).exec().await.unwrap();
            let mut products: Vec<Product> = Vec::new();
            
            for product in _products.iter() {
                let product_id = &product.id;
                let _reviews = ctx.db.feedback()
                    .find_many(vec![prisma::feedback::product::is(vec![prisma::products::id::equals(product_id.to_string())])])
                    .exec()
                    .await
                    .unwrap();
                let mut reviews: Vec<Reviews> = Vec::new();

                for review in _reviews.iter() {
                    let username = ctx.db.feedback_orders().find_first(vec![]).exec().await.unwrap().unwrap().username;
                    
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

