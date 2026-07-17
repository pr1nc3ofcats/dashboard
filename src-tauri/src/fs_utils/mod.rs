use std::{path::PathBuf, str::FromStr};

use sysinfo::{Disk, Disks};
use tauri::Manager;

// Returns disk where provided path is mounted
fn get_disk_by_path(p: PathBuf, disks: &Disks) -> Option<&Disk> {
    // By longest prefix
    disks.iter().max_by_key(|disk| {
        let mount_point = disk.mount_point();
        if p.starts_with(mount_point) {
            mount_point.as_os_str().len()
        } else {
            0
        }
    })
}

/// In megabytes
#[tauri::command]
pub fn get_free_space(directory: String) -> Result<f64, String> {
    let directory = PathBuf::from_str(&directory).map_err(|e| e.to_string())?;
    let disks = Disks::new_with_refreshed_list();

    let matching_disk = get_disk_by_path(directory, &disks);

    let bytes = matching_disk
        .ok_or("disk not found")
        .map(|disk| disk.available_space())?;

    Ok(bytes as f64 / (1024.0 * 1024.0))
}

/// In megabytes
#[tauri::command]
pub fn get_all_space(directory: String) -> Result<f64, String> {
    let directory = PathBuf::from_str(&directory).map_err(|e| e.to_string())?;
    let disks = Disks::new_with_refreshed_list();

    let matching_disk = get_disk_by_path(directory, &disks);

    let bytes = matching_disk
        .ok_or("disk not found")
        .map(|disk| disk.total_space())?;

    Ok(bytes as f64 / (1024.0 * 1024.0))
}

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

fn clean_path(p: &PathBuf) -> String {
    let p = p.canonicalize().unwrap();
    let mut str = p.to_str().unwrap();
    str = str.strip_prefix("\\\\?\\").unwrap_or(str);
    str = str.strip_suffix("\\").unwrap_or(str);
    str.replace("\\", "/")
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
