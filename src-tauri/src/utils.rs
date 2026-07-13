#[tauri::command]
pub fn get_user_name() -> Result<String, String> {
    whoami::username().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn show_window(window: tauri::Window) {
    window.show().unwrap();
}