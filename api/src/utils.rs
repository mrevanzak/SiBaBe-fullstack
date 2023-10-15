use std::env;

use axum::http::HeaderValue;
use jsonwebtoken::{ decode, DecodingKey, Validation, Algorithm };

use serde::{ Serialize, Deserialize };
use tokio::signal;

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

pub(crate) fn get_user(token: Option<HeaderValue>) -> Option<Role> {
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

  let jwt = token?;
  let key = env
    ::var("CLERK_PEM_PUBLIC_KEY")
    .expect("CLERK_PEM_PUBLIC_KEY not found")
    .replace("\\n", "\n");
  let decode = decode::<Claims>(
    &jwt.to_str().unwrap().trim_start_matches("Bearer "),
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
    Err(_) => {
      println!("Error decoding token");
      Role::None
    }
  };

  Some(role)
}
