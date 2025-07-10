use sha2::{Sha256, Digest};
use std::env;
use dotenvy::dotenv;

pub fn hash_password(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    hex::encode(result)
}

#[tauri::command]
pub async fn verify_password(input: String) -> Result<bool, String> {
    dotenvy::dotenv().ok();

    let hashed_env = env::var("HASHED_PASSWORD").map_err(|e| e.to_string())?;

    let hashed_input = hash_password(&input);

    Ok(hashed_input == hashed_env)
}