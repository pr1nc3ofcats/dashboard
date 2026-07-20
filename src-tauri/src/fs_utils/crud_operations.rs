use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use crate::fs_utils::clean_path;

#[tauri::command]
pub async fn save_bytes_to_file(bytes: Vec<u8>, path: String) -> Result<(), String> {
    tokio::fs::write(path, bytes).await.map_err(|e| e.to_string())
}

#[derive(Serialize, Deserialize, Default)]
pub struct LinkData {
    command: Vec<String>,
    working_dir: String,
}

#[tauri::command]
pub fn read_lnk_file(path: String) -> Result<LinkData, String> {
    let link = lnk::ShellLink::open(path, lnk::encoding::WINDOWS_1252).map_err(|e| e.to_string())?;
    let mut result = LinkData::default();

    if let Some(working_dir) = link.string_data().working_dir() {
        result.working_dir = clean_path(&PathBuf::from(working_dir));
    }

    if let Some(target) = link.link_target() {
        result.command.push(target);
    } else {
        return Err(String::from("Link does not contain a valid target"));
    }

    if let Some(args) = link.string_data().command_line_arguments() {
        let mut splitted = args.split(" ").map(String::from).collect::<Vec<String>>();
        result.command.append(&mut splitted);
    }
    
    Ok(result)
}