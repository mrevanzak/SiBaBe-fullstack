use std::sync::Arc;

use crate::prisma;
use axum::http::HeaderValue;
use rspc::{ Config, RouterBuilder };
use std::path::PathBuf;

mod carts;
mod products;
pub mod users;

#[derive(Clone, Debug)]
pub struct Ctx {
  pub db: Arc<prisma::PrismaClient>,
  pub token: Option<HeaderValue>,
}

pub type Router = rspc::Router<Ctx>;

pub(crate) fn new() -> RouterBuilder<Ctx> {
  Router::new()
    .config(
      Config::new().export_ts_bindings(
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("..").join("src/utils/api.ts")
      )
    )
    .merge("products.", products::route())
    .merge("carts.", carts::route())
}
