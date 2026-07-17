use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tokio::fs;

#[derive(Serialize, Deserialize)]
pub struct MappedDirEntry {
    name: String,
    modified: DateTime<Utc>,
    size: u64,
    is_dir: bool,
}

#[tauri::command]
pub async fn get_dir_entries(directory: String) -> Result<Vec<MappedDirEntry>, String> {
    let mut result = Vec::new();
    let mut entries = fs::read_dir(&directory).await.map_err(|e| e.to_string())?;

    while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        let metadata = entry.metadata().await.map_err(|e| e.to_string())?;

        result.push(MappedDirEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            modified: metadata.modified().map_err(|e| e.to_string())?.into(),
            size: metadata.len(),
            is_dir: metadata.is_dir(),
        });
    }

    Ok(result)
}