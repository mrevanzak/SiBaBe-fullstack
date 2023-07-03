use std::sync::Arc;
use std::vec;

use crate::prisma;
use rspc::Config;
use rspc::RouterBuilder;
use std::path::PathBuf;

pub struct Ctx {
    pub client: Arc<prisma::PrismaClient>,
}

pub type Router = rspc::Router<Ctx>;

pub(crate) fn new() -> RouterBuilder<Ctx> {
    Router::new()
        .config(
            Config::new()
                .export_ts_bindings(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("..").join("web/src/utils/api.ts"))
        )
        .query("products", |t| {
            t(|ctx, _: ()| async move {
                let products = ctx.client.products().find_many(vec![]).exec().await.unwrap();
                Ok(products)
            })
        })
}
