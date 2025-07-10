use crate::{
  core::db::DbState,
  core::models::*,
  core::crypto::{encrypt, decrypt}
};
use tauri::State;
use rusqlite::params;
use chrono::Utc;
// use std::env;

// utility
fn get_key() -> Result<[u8; 32], String> {
  let key = std::env::var("SECRET_KEY").map_err(|e| e.to_string())?;
  key.as_bytes()
    .try_into()
    .map_err(|_| "SECRET_KEY must be 32 bytes long".to_string() )
}

// remember to call `.manage(MyState::default())`
#[tauri::command]
pub async fn add_diary_entry(entry: NewDiaryEntry, state: State<'_, DbState>) -> Result<(), String> {
  let conn = state.conn.lock().map_err(|e| e.to_string())?;
  let created_at = Utc::now().to_rfc3339();

  let key = get_key()?;
  let encrypted_title = encrypt(&key, &entry.title).map_err(|e| e.to_string())?;
  let encrypted_content = encrypt(&key, &entry.content).map_err(|e| e.to_string())?;

  conn.execute(
    "INSERT OR REPLACE INTO entries (title, content, created_at) VALUES (?1, ?2, ?3)",
    params![encrypted_title, encrypted_content, created_at]
  )
  .map_err(|e| e.to_string())?;

  Ok(())
}

#[tauri::command]
pub async fn get_diary_titles(state: State<'_, DbState>) -> Result<Vec<DiaryTitle>, String> {
  let conn = state.conn.lock().unwrap();
  let mut stmt = conn
    .prepare("SELECT id, title, created_at FROM entries ORDER BY created_at DESC")
    .map_err(|e| e.to_string())?;

  let key = get_key()?;

  let result = stmt
    .query_map([], |row| {
      let id: i32 = row.get(0)?;
      let enc_title: String = row.get(1)?;
      let created_at: String = row.get(2)?;

      let decrypted_title = 
        decrypt(&key, &enc_title)
        .unwrap_or_else(|_| "Decryption failed".to_string());

      Ok(DiaryTitle {
        id,
        title: decrypted_title,
        created_at,
      })
    })
    .map_err(|e| e.to_string())?
    .filter_map(Result::ok)
    .collect();

  Ok(result)
}

#[tauri::command]
pub async fn get_diary_content(id: i32, state: State<'_, DbState>) -> Result<DiaryDetail, String> {
  let conn = state.conn.lock().unwrap();
  let mut stmt = conn
    .prepare("SELECT title, content FROM entries WHERE id = ?1")
    .map_err(|e| e.to_string())?;
    
  let ( enc_title, enc_content ): (String, String ) = stmt
    .query_row([id], |row| Ok((row.get(0)?, row.get(1)?)))
    .map_err(|e| e.to_string())?;
    
  let key = get_key()?;
  let decrypted_title = decrypt(&key, &enc_title).map_err(|e| e.to_string())?;
  let decrypted_content = decrypt(&key, &enc_content).map_err(|e| e.to_string())?;

  Ok(DiaryDetail {
    title: decrypted_title,
    content: decrypted_content,
  })
}

#[tauri::command]
pub async fn update_diary_title(id: i32, new_title: String, state: State<'_, DbState>) -> Result<(), String> {
  let conn = state.conn.lock().unwrap();

  let key = get_key()?;
  let encrypted_title = encrypt(&key, &new_title).map_err(|e| e.to_string())?;

  conn.execute(
    "UPDATE entries SET title = ?1 WHERE id = ?2",
    params![encrypted_title, id],
  )
  .map_err(|e| e.to_string())?;

  Ok(())  
}

#[tauri::command]
pub async fn update_diary_content(entry: UpdateDiaryEntry, state: State<'_, DbState>) -> Result<(), String> {
  let conn = state.conn.lock().unwrap();

  let key = get_key()?;
  let encrypted_title = encrypt(&key, &entry.title).map_err(|e| e.to_string())?;
  let encrypted_content = encrypt(&key, &entry.content).map_err(|e| e.to_string())?;

  conn.execute(
    "UPDATE entries SET content = ?1, title = ?2 WHERE id = ?3",
    params![encrypted_content, encrypted_title, entry.id],
  )
  .map_err(|e| e.to_string())?;

  Ok(())
}

#[tauri::command]
pub async fn delete_diary_entry(id: i32, state: State<'_, DbState>) -> Result<(), String> {
  let conn = state.conn.lock().unwrap();

  conn.execute(
    "DELETE FROM entries WHERE id = ?1",
    params![id],
  )
  .map_err(|e| e.to_string())?;

  Ok(())
}
