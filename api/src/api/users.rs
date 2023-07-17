use std::{ env, sync::Arc };

use axum::{ body::Bytes, http::{ HeaderMap, StatusCode }, routing::post, Extension, Router };

use rspc::{ Error, ErrorCode, RouterBuilder };
use serde::{ Deserialize, Serialize };
use svix::webhooks::Webhook;

use crate::prisma::{ self, PrismaClient };

use super::{ PrivateCtx, PrivateRouter };

#[derive(Serialize, Deserialize)]
struct Payload {
  data: Data,
  object: String,
  r#type: String,
}

#[derive(Clone, Debug)]
pub enum Role {
  Admin(String),
  Customer(String),
  None,
}

impl Role {
  pub fn get_id(&self) -> String {
    match self {
      Role::Admin(id) => id.to_string(),
      Role::Customer(id) => id.to_string(),
      Role::None => "".to_string(),
    }
  }
  pub fn admin_unauthorized(&self) -> Result<(), Error> {
    match self {
      Role::Admin(_) =>
        Err(
          Error::new(ErrorCode::Unauthorized, "Admin tidak bisa mengakses halaman ini".to_string())
        ),
      _ => Ok(()),
    }
  }
}

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
enum Data {
  Deleted {
    deleted: bool,
    id: String,
  },
  CreatedOrUpdated {
    created_at: u64,
    email_addresses: Vec<EmailAddress>,
    first_name: String,
    id: String,
    image_url: String,
    last_name: String,
    profile_image_url: String,
    public_metadata: serde_json::Value,
    updated_at: u64,
    username: String,
  },
}

#[derive(Serialize, Deserialize)]
struct EmailAddress {
  email_address: String,
  id: String,
}

async fn users_handler(
  db: Extension<Arc<PrismaClient>>,
  headers: HeaderMap,
  body: Bytes
) -> Result<StatusCode, StatusCode> {
  let wh = Webhook::new(
    env::var("WEBHOOK_SECRET").expect("WEBHOOK_SECRET not found").as_str()
  ).map_err(|_| {
    println!("Webhook secret not found");
    StatusCode::INTERNAL_SERVER_ERROR
  })?;
  let payload: Payload = serde_json::from_slice(&body).unwrap();

  wh.verify(&body, &headers).map_err(|_| {
    println!("Webhook verification failed");
    StatusCode::UNAUTHORIZED
  })?;

  match payload.data {
    Data::CreatedOrUpdated {
      id,
      username,
      first_name,
      last_name,
      email_addresses,
      public_metadata,
      ..
    } => {
      if payload.r#type == "user.created" {
        let name = format!("{} {}", first_name, last_name);
        let email = &email_addresses[0].email_address;

        let user = db
          .customers()
          .create(id, username, name, email.to_string(), vec![])
          .exec().await;
        match user {
          Ok(_) => println!("User created"),
          Err(_) => println!("User not created"),
        }
      } else if payload.r#type == "user.updated" {
        let user = db.customers().delete(prisma::customers::id::equals(id.clone())).exec().await;
        match user {
          Ok(_) => println!("User deleted"),
          Err(_) => println!("User not deleted"),
        }

        let name = format!("{} {}", first_name, last_name);
        let email = &email_addresses[0].email_address;

        if public_metadata["role"] == "admin" {
          let admin = db
            .admins()
            .create(id, username, name, email.to_string(), vec![])
            .exec().await;

          match admin {
            Ok(_) => println!("User promoted to admin"),
            Err(_) => println!("User failed to be promoted to admin"),
          }
        }
      } else {
        println!("Unknown user event type");
      }
      Ok(StatusCode::OK)
    }
    Data::Deleted { id, .. } => {
      let user = db.customers().delete(prisma::customers::id::equals(id)).exec().await;
      match user {
        Ok(_) => println!("User deleted"),
        Err(_) => println!("User not deleted"),
      }
      Ok(StatusCode::OK)
    }
  }
}

pub(crate) fn webhooks(client: Arc<PrismaClient>) -> Router {
  Router::new().route("/webhooks", post(users_handler)).layer(Extension(client))
}

pub(crate) fn private_route() -> RouterBuilder<PrivateCtx> {
  PrivateRouter::new().query("get", |t| {
    t(|ctx: PrivateCtx, _: ()| async move {
      let users = ctx.db
        .customers()
        .find_first(vec![prisma::customers::id::equals(ctx.user_id)])
        .exec().await?;
      Ok(users)
    })
  })
}
