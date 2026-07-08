use std::fs;
use tauri::Manager;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Settings {
    accent_color: String,
    wallapper: String,
    avatar_image: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            accent_color: String::from("#C48A61"),
            wallapper: String::from("images/backgrounds/default.webp"),
            avatar_image: String::from("images/avatar.png"),
        }
    }
}

#[tauri::command]
pub fn parse_settings(app_handle: tauri::AppHandle) -> Result<Settings, String> {
    let mut settings = Settings::default();

    let file_path = app_handle
        .path()
        .app_local_data_dir()
        .map_err(|e| e.to_string())?.join("settings.json");
    if file_path.exists() {
        let json_string = fs::read_to_string(file_path).map_err(|e| e.to_string())?;
        settings = serde_json::from_str(&json_string).map_err(|e| format!("Settings file corrupted: {}", e.to_string()))?;
    }

    Ok(settings)
}

#[tauri::command(rename_all = "snake_case")]
pub fn dump_settings(app_handle: tauri::AppHandle, settings: Settings) -> Result<(), String> {
    let file_path = app_handle
        .path()
        .app_local_data_dir()
        .map_err(|e| e.to_string())?.join("settings.json");
    let json_string = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    
    fs::write(file_path, json_string).map_err(|e| e.to_string())
}