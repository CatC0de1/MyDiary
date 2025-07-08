use aes_gcm::{Aes256Gcm, KeyInit, Nonce};
use aes_gcm::aead::{Aead, OsRng, generic_array::GenericArray};
use base64::{engine::general_purpose, Engine};

const NONCE_SIZE: usize = 12; // AES-GCM standard nonce size

// key 32 byte (265 bit)
// pub const SECRET_KEY: &[u8] = b"01234567890123456789012345678901"; // Example key

pub fn encrypt(key: &[u8; 32], plaintext: &str) -> Result<String, String> {
    let cipher = Aes256Gcm::new(GenericArray::from_slice(key));
    let nonce_bytes: [u8; NONCE_SIZE] = rand::random();
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher
        .encrypt(nonce, plaintext.as_bytes())
        .map_err(|e| e.to_string())?;
    let mut result = nonce_bytes.to_vec();
    result.extend(ciphertext);

    Ok(general_purpose::STANDARD.encode(result))
}

pub fn decrypt(key: &[u8; 32], encrypted: &str) -> Result<String, String> {
    let decoded = general_purpose::STANDARD
        .decode(encrypted)
        .map_err(|e| e.to_string())?;

    if decoded.len() < NONCE_SIZE {
        return Err("Invalid encrypted data".into());
    }

    let (nonce, ciphertext) = decoded.split_at(NONCE_SIZE);
    let cipher = Aes256Gcm::new(GenericArray::from_slice(key));
    let plaintext = cipher
        .decrypt(Nonce::from_slice(nonce), ciphertext)
        .map_err(|e| e.to_string())?;

    Ok(String::from_utf8(plaintext).map_err(|e| e.to_string())?)
}