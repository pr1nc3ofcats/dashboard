use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

use crate::models::application::Application;

fn library_file_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("Could not resolve app local data dir: {e}"))?;

    fs::create_dir_all(&dir).map_err(|e| format!("Could not create app local data dir: {e}"))?;

    Ok(dir.join("library.json"))
}

#[tauri::command]
pub fn parse_applications(app: AppHandle) -> Result<Vec<Application>, String> {
    let path = library_file_path(&app)?;

    if !path.exists() {
        fs::write(&path, "[]").map_err(|e| format!("Could not create library.json: {e}"))?;
        return Ok(Vec::new());
    }

    let content =
        fs::read_to_string(&path).map_err(|e| format!("Could not read library.json: {e}"))?;

    if content.trim().is_empty() {
        return Ok(Vec::new());
    }

    serde_json::from_str::<Vec<Application>>(&content)
        .map_err(|e| format!("Could not parse library.json: {e}"))
}

#[tauri::command]
pub fn dump_applications(app: AppHandle, apps: Vec<Application>) -> Result<(), String> {
    let path = library_file_path(&app)?;

    let json = serde_json::to_string_pretty(&apps)
        .map_err(|e| format!("Could not serialize applications: {e}"))?;

    fs::write(&path, json).map_err(|e| format!("Could not write library.json: {e}"))?;

    Ok(())
}
