use std::sync::Arc;

use crate::prisma;
use rspc::{ Config, RouterBuilder };
use tower_cookies::Cookies;
use std::path::PathBuf;

mod products;
pub mod users;

#[derive(Clone, Debug)]
pub struct Ctx {
  pub db: Arc<prisma::PrismaClient>,
  pub cookies: Cookies,
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
}
