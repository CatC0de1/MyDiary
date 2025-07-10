use rusqlite::Connection;
use std::sync::Mutex;

// #[derive(Default)]
pub struct DbState {
  pub conn: Mutex<Connection>
}

impl DbState {
  pub fn new() -> Self {
    let conn = Connection::open("../data/diary.db").expect("Failed to openDB");
    conn.execute(
      "CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      )",
      [],
    ).expect("Failed to create table");
    
    DbState {
      conn: Mutex::new(conn)
    }
  }
}