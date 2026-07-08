#[tauri::command]
pub fn get_user_name() -> Result<String, String> {
    whoami::username().map_err(|e| e.to_string())
}