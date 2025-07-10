use serde::{Deserialize, Serialize};

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