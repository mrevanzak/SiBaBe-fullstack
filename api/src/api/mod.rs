use std::sync::Arc;

use crate::prisma;
use rspc::Config;
use rspc::RouterBuilder;
use std::path::PathBuf;

mod products;

pub struct Ctx {
    pub db: Arc<prisma::PrismaClient>,
}

pub type Router = rspc::Router<Ctx>;

pub(crate) fn new() -> RouterBuilder<Ctx> {
    Router::new()
        .config(
            Config::new()
                .export_ts_bindings(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("..").join("web/src/utils/api.ts"))
        )
        .merge("products.", products::route())
}
