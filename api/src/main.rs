use axum::routing::get;
use rspc::integrations::httpz::Request;
use std::{ env, net::SocketAddr, sync::Arc };
use tower_http::cors::CorsLayer;
use tower_cookies::{ Cookies, CookieManagerLayer };

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
    .merge(api::users::webhooks(client.clone()))
    .nest(
      "/rspc",
      router
        .endpoint(move |mut req: Request| {
          println!("Client requested operation '{}'", &req.uri().path());
          let cookies = req
            .deprecated_extract::<Cookies, ()>()
            .expect("Error extracting cookies")
            .unwrap();
          api::Ctx { db: client.clone(), cookies }
        })
        .axum()
    )
    .layer(CookieManagerLayer::new())
    .layer(CorsLayer::very_permissive())
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
