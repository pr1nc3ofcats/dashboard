use std::sync::Mutex;

use tauri::Manager;

mod models;
mod utils;
mod windows_utils;

use models::{settings, library};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(Mutex::new(windows_utils::RunningProcesses::default()))
        .invoke_handler(tauri::generate_handler![
            settings::parse_settings,
            settings::dump_settings,
            utils::get_user_name,
            utils::show_window,
            windows_utils::try_spawn_detached,
            windows_utils::try_focuse_window,
            library::dump_applications,
            library::parse_applications
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_fullscreen(true)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
