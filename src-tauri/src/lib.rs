// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod core;

use core::{ auth, entries };
use core::db::DbState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // std::panic::set_hook(Box::new(|info| {
    //     println!("Panic occurred: {:?}", info);
    // }));

    tauri::Builder::default()
        .manage(DbState::new())
        .invoke_handler(tauri::generate_handler![
            auth::verify_password,
            entries::add_diary_entry,
            entries::get_diary_titles,
            entries::get_diary_content,
            entries::update_diary_title,
            entries::update_diary_content,
            entries::delete_diary_entry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}