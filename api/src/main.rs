use axum::{ http::{ Method, header }, routing::get };

use rspc::integrations::httpz::Request;
use std::{ env, net::SocketAddr, sync::Arc };
use tower_http::cors::{ Any, CorsLayer };

mod api;
#[allow(unused)]
mod prisma;
mod utils;

fn router(client: Arc<prisma::PrismaClient>) -> axum::Router {
  let router = api::new().build().arced();

  axum::Router
    ::new()
    .route(
      "/",
      get(|| async { "Hello 'rspc'!" })
    )
    .merge(api::users::route(client.clone()))
    .nest(
      "/rspc",
      router
        .endpoint(move |req: Request| {
          println!("Client requested operation '{}'", req.uri().path());
          api::Ctx { db: client.clone() }
        })
        .axum()
    )
    .layer(
      CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(vec![header::AUTHORIZATION, header::ACCEPT, header::CONTENT_TYPE])
    )
}

#[tokio::main]
async fn main() {
  dotenv::dotenv().ok();
  let client = Arc::new(prisma::new_client().await.unwrap());

  let port = env::var("PORT").unwrap_or("9000".to_string());
  let addr = format!("[::]:{}", port).parse::<SocketAddr>().unwrap();
  println!("{} listening on http://{}", env!("CARGO_CRATE_NAME"), addr);
  axum::Server
    ::bind(&addr)
    .serve(router(client).into_make_service())
    .with_graceful_shutdown(utils::axum_shutdown_signal()).await
    .expect("Error with HTTP server!");
}
