use std::{env, sync::Arc};

use axum::{http::{HeaderMap, StatusCode}, body::Bytes, Extension};
use serde::{Deserialize, Serialize};
use svix::webhooks::Webhook;

use crate::prisma::{PrismaClient, self};

#[derive(Serialize, Deserialize)]
struct Payload {
    data: Data,
    object: String,
    r#type: String,
}



#[derive(Serialize, Deserialize)]
#[serde(untagged)]
enum Data {
    Deleted {
        deleted: bool,
        id: String,
    },
    CreatedOrUpdated{
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
    }
}

#[derive(Serialize, Deserialize)]
struct EmailAddress {
    email_address: String,
    id: String,
}
pub async fn users_handler(
    db: Extension<Arc<PrismaClient>>,
    headers: HeaderMap,
    body: Bytes,
) -> StatusCode {
    let wh = Webhook::new(env::var("WEBHOOK_SECRET").unwrap().as_str());
    let payload: Payload = serde_json::from_slice(&body).unwrap();

    match wh {
        Ok(wh) => {
            match wh.verify(&body, &headers) {
                Ok(_) => {
                    match payload.data {
                        Data::CreatedOrUpdated{
                            id,
                            username,
                            first_name,
                            last_name,
                            email_addresses,
                            public_metadata,
                            ..
                        } => {
                                if payload.r#type == "user.created"{
                                    let name = format!("{} {}", first_name, last_name);
                                    let email = &email_addresses[0].email_address;

                                    let user = db.customers().create(
                                        id,
                                        username,
                                        name,
                                        email.to_string(),
                                        vec![],

                                    ).exec().await;
                                    match user {
                                        Ok(_) => println!("User created"),
                                        Err(_) => println!("User not created"),
                                    }
                                } else if payload.r#type == "user.updated"{
                                    let user = db.customers().delete(prisma::customers::id::equals(id.clone())).exec().await;
                                    match user {
                                        Ok(_) => println!("User deleted"),
                                        Err(_) => println!("User not deleted"),
                                    }

                                    let name = format!("{} {}", first_name, last_name);
                                    let email = &email_addresses[0].email_address;

                                    if public_metadata["role"] == "admin"{
                                        let admin = db.admins()
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
                            }
                        Data::Deleted { id, .. } => {
                            let user = db.customers().delete(prisma::customers::id::equals(id)).exec().await;
                            match user {
                                Ok(_) => println!("User deleted"),
                                Err(_) => println!("User not deleted"),
                            }
                        }
                    }
                    StatusCode::OK

                }
                Err(_) => StatusCode::UNAUTHORIZED,
            }
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}
