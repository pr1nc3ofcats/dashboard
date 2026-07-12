use tauri::Manager;

mod settings;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![settings::parse_settings, settings::dump_settings, utils::get_user_name, utils::try_spawn_detached])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_fullscreen(true)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
