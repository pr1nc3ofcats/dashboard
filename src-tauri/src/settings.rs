use std::fs;
use tauri::Manager;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Settings {
    accent_color: String,
    wallapper: String,
    avatar_image: String,

    sfx_volume: f32,
    background_music: String,
    background_music_volume: f32,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            accent_color: String::from("#C48A61"),
            wallapper: String::default(),
            avatar_image: String::default(),

            sfx_volume: 0.3,
            background_music: String::default(),
            background_music_volume: 0.1
        }
    }
}

#[tauri::command]
pub fn parse_settings(app_handle: tauri::AppHandle) -> Result<Settings, String> {
    let mut settings = Settings::default();
    settings.wallapper = app_handle
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?.join("images/backgrounds/default.webp").to_str().unwrap().into();
    settings.avatar_image = app_handle
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?.join("images/default-avatar.webp").to_str().unwrap().into();
    settings.background_music = app_handle
        .path()
        .resource_dir()
        .map_err(|e| e.to_string())?.join("music/The Night Swim.mp3").to_str().unwrap().into();

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