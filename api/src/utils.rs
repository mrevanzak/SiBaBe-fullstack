use std::env;

use jsonwebtoken::{ decode, DecodingKey, Validation, Algorithm };
use rspc::{ Error, ErrorCode };
use serde::{ Serialize, Deserialize };
use tokio::signal;
use tower_cookies::Cookies;

use crate::api::users::Role;

/// shutdown_signal will inform axum to gracefully shutdown when the process is asked to shutdown.
pub async fn axum_shutdown_signal() {
  let ctrl_c = async {
    signal::ctrl_c().await.expect("failed to install Ctrl+C handler");
  };

  #[cfg(unix)]
  let terminate = async {
    signal::unix
      ::signal(signal::unix::SignalKind::terminate())
      .expect("failed to install signal handler")
      .recv().await;
  };

  #[cfg(not(unix))]
  let terminate = std::future::pending::<()>();

  tokio::select! {
		_ = ctrl_c => {},
		_ = terminate => {},
	}

  println!("signal received, starting graceful shutdown");
}

pub(crate) fn get_user(cookies: Cookies) -> Role {
  #[derive(Debug, Serialize, Deserialize)]
  struct Claims {
    azp: String,
    exp: usize,
    iat: usize,
    iss: String,
    nbf: usize,
    sid: String,
    sub: String,
    role: Option<String>,
  }

  let token = cookies
    .get("__session")
    .map(|c| c.value().to_string())
    .ok_or(Error::new(ErrorCode::Unauthorized, "Cannot get session".to_string()));
  let key = env
    ::var("CLERK_PEM_PUBLIC_KEY")
    .expect("CLERK_PEM_PUBLIC_KEY not found")
    .replace("\\n", "\n");
  let decode = decode::<Claims>(
    &token.unwrap(),
    &DecodingKey::from_rsa_pem(key.as_bytes()).unwrap(),
    &Validation::new(Algorithm::RS256)
  );

  let role: Role = match decode {
    Ok(token) =>
      match token.claims.role {
        Some(role) =>
          match role.as_str() {
            "admin" => Role::Admin(token.claims.sub),
            _ => Role::None,
          }
        None => Role::Customer(token.claims.sub),
      }
    Err(_) => Role::None,
  };

  role
}
