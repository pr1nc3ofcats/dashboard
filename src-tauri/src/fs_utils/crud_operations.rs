#[tauri::command]
pub async fn save_bytes_to_file(bytes: Vec<u8>, path: String) -> Result<(), String> {
    tokio::fs::write(path, bytes).await.map_err(|e| e.to_string())
}