// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

// #[cfg_attr(mobile, tauri::mobile_entry_point)]
// pub fn run() {
//     tauri::Builder::default()
//         .plugin(tauri_plugin_opener::init())
//         .invoke_handler(tauri::generate_handler![greet])
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }

mod crypto;

use std::sync::Mutex;
use tauri::State;
use rusqlite::{Connection, params};
use serde::{Serialize, Deserialize};
use chrono::Utc;
use dotenvy::dotenv;
use std::env;
use crypto::{encrypt, decrypt};

// #[derive(Default)]
pub struct DbState {
    pub conn: Mutex<Connection>
}

// This struct represents a new diary entry that will be created
#[derive(Deserialize)]
pub struct NewDiaryEntry {
    pub title: String,
    pub content: String,
}

#[derive(Deserialize)]
pub struct UpdateDiaryEntry {
    pub id: i32,
    pub title: String,
    pub content: String,
}

// This struct represents a diary entry that will be returned to the frontend
#[derive(Serialize)]
pub struct DiaryTitle {
    pub id: i32,
    pub title: String,
    pub created_at: String,
}

#[derive(Serialize)]
pub struct DiaryDetail {
    pub title: String,
    pub content: String,
}


fn init_db() -> Connection {
    dotenvy::dotenv().ok();
    let conn = Connection::open("../data/diary.db").expect("Failed to open DB");
    conn.execute(
        "CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        )",
        [],
    ).expect("Failed to create table");
    conn
}

// remember to call `.manage(MyState::default())`
#[tauri::command]
async fn add_diary_entry(entry: NewDiaryEntry, state: State<'_, DbState>) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let created_at = Utc::now().to_rfc3339();
    let secret_key = env::var("SECRET_KEY").map_err(|e| e.to_string())?;
    let key_bytes: [u8; 32] = secret_key.as_bytes().try_into().map_err(|_| "SECRET_KEY must be 32 bytes long")?;

    // let encrypted_title = encrypt(SECRET_KEY, &entry.title).map_err(|e| e.to_string())?;
    let encrypted_content = encrypt(&key_bytes, &entry.content).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT OR REPLACE INTO entries (title, content, created_at) VALUES (?1, ?2, ?3)",
        params![entry.title, encrypted_content, created_at],
    )
    .map_err(|e| {
        println!("Error insert diary: {}", e);
        e.to_string()
    })?;

    Ok(())
}

#[tauri::command]
async fn get_diary_titles(state: State<'_, DbState>) -> Result<Vec<DiaryTitle>, String> {
    let conn = state.conn.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT id, title, created_at FROM entries ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;

    let result = stmt
        .query_map([], |row| {
            Ok(DiaryTitle {
                id: row.get(0)?,
                title: row.get(1)?,
                created_at: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(Result::ok)
        .collect();

    Ok(result)
}

#[tauri::command]
async fn get_diary_content(id: i32, state: State<'_, DbState>) -> Result<DiaryDetail, String> {
    let conn = state.conn.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT title, content FROM entries WHERE id = ?1")
        .map_err(|e| e.to_string())?;
    
    let ( title, enc_content ): (String, String ) = 
        stmt.query_row([id], |row| Ok((row.get(0)?, row.get(1)?)))
            .map_err(|e| e.to_string())?;
    
    let secret_key = env::var("SECRET_KEY").map_err(|e| e.to_string())?;
    let key_bytes: [u8; 32] = secret_key.as_bytes().try_into().map_err(|_| "SECRET_KEY must be 32 bytes long")?;
    let decrypted_content = decrypt(&key_bytes, &enc_content).map_err(|e| e.to_string())?;

    Ok(DiaryDetail {
        title,
        content: decrypted_content,
    })
}

#[tauri::command]
async fn update_diary_entry(entry: UpdateDiaryEntry, state: State<'_, DbState>) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();

    let secret_key = env::var("SECRET_KEY").map_err(|e| e.to_string())?;
    let key_bytes: [u8; 32] = secret_key.as_bytes().try_into().map_err(|_| "SECRET_KEY must be 32 bytes long")?;

    // let encrypted_title = encrypt(SECRET_KEY, &entry.title).map_err(|e| e.to_string())?;
    let encrypted_content = encrypt(&key_bytes, &entry.content).map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE entries SET content = ?1, title = ?2 WHERE id = ?3",
        params![encrypted_content, entry.title, entry.id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn delete_diary_entry(id: i32, state: State<'_, DbState>) -> Result<(), String> {
    let conn = state.conn.lock().unwrap();

    conn.execute(
        "DELETE FROM entries WHERE id = ?1",
        params![id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}    

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    std::panic::set_hook(Box::new(|info| {
        println!("Panic occurred: {:?}", info);
    }));

    tauri::Builder::default()
        .manage(DbState {
            conn: Mutex::new(init_db()),
        })
        .invoke_handler(tauri::generate_handler![
            add_diary_entry,
            get_diary_titles,
            get_diary_content,
            update_diary_entry,
            delete_diary_entry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}