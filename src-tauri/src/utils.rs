use std::{path::PathBuf, str::FromStr};

use sysinfo::{Disk, Disks};

#[tauri::command]
pub fn get_user_name() -> Result<String, String> {
    whoami::username().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn show_window(window: tauri::Window) {
    window.show().unwrap();
}

fn get_disk_by_path(p: PathBuf, disks: &Disks) -> Option<&Disk> {
    // By longest prefix
    disks.iter().max_by_key(|disk| {
        println!("{}", disk.available_space());
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
