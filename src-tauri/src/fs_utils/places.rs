use std::path::PathBuf;

use sysinfo::Disks;
use tauri::Manager;

use crate::fs_utils::clean_path;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Volume {
    name: String,
    mount_point: String,
    is_removable: bool,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Places {
    home: String,
    desktop: String,
    documents: String,
    download: String,
    videos: String,
    pictures: String,
    music: String,
    volumes: Vec<Volume>,
}

#[tauri::command]
pub fn get_fs_places(app: tauri::AppHandle) -> Result<Places, String> {
    let p = app.path();
    let mut result = Places {
        home: clean_path(&p.home_dir().unwrap_or_default()),
        desktop: clean_path(&p.desktop_dir().unwrap_or_default()),
        documents: clean_path(&p.document_dir().unwrap_or_default()),
        download: clean_path(&p.download_dir().unwrap_or_default()),
        videos: clean_path(&p.video_dir().unwrap_or_default()),
        pictures: clean_path(&p.picture_dir().unwrap_or_default()),
        music: clean_path(&p.audio_dir().unwrap_or_default()),
        volumes: Vec::default(),
    };

    let disks = Disks::new_with_refreshed_list();
    result.volumes = disks
        .into_iter()
        .map(|d| Volume {
            name: d.name().to_string_lossy().to_string(),
            mount_point: clean_path(&PathBuf::from(d.mount_point())),
            is_removable: d.is_removable(),
        })
        .collect();

    Ok(result)
}
