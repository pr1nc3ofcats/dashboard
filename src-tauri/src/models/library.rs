use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Achievement {
    pub img: String,
    pub name: String,
    pub achieved: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct Requirements {
    pub minimal: String,
    pub recommended: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct HowLongToBeat {
    #[serde(rename = "mainStory")]
    pub main_story: f64,
    #[serde(rename = "mainPlusSides")]
    pub main_plus_sides: f64,
    pub completionist: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct SteamDetails {
    #[serde(rename = "imgHero", skip_serializing_if = "Option::is_none")]
    pub img_hero: Option<String>,

    #[serde(rename = "imgSteamHorizontal", skip_serializing_if = "Option::is_none")]
    pub img_steam_horizontal: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub screeenshots: Option<Vec<String>>,

    #[serde(
        rename = "detailedDescription",
        skip_serializing_if = "Option::is_none"
    )]
    pub detailed_description: Option<String>,

    #[serde(rename = "releaseDate", skip_serializing_if = "Option::is_none")]
    pub release_date: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub developers: Option<Vec<String>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub publishers: Option<Vec<String>>,

    #[serde(rename = "pcRequirements", skip_serializing_if = "Option::is_none")]
    pub pc_requirements: Option<Requirements>,

    #[serde(rename = "linuxRequirements", skip_serializing_if = "Option::is_none")]
    pub linux_requirements: Option<Requirements>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub achievements: Option<Vec<Achievement>>,

    #[serde(rename = "howLongToBeat", skip_serializing_if = "Option::is_none")]
    pub how_long_to_beat: Option<HowLongToBeat>,

    #[serde(rename = "steamId", skip_serializing_if = "Option::is_none")]
    pub steam_id: Option<u64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Application {
    pub id: u64,
    pub title: String,
    pub command: Vec<String>,

    #[serde(rename = "imgSquare")]
    pub img_square: String,

    pub categories: Vec<String>,

    pub playtime: u64,

    // dayjs().toDate()
    #[serde(rename = "lastLaunched", skip_serializing_if = "Option::is_none")]
    pub last_launched: Option<chrono::DateTime<chrono::Utc>>,

    #[serde(rename = "shortDescription", skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,

    #[serde(rename = "dataPath", skip_serializing_if = "Option::is_none")]
    pub data_path: Option<String>,

    #[serde(rename = "steamDetails", skip_serializing_if = "Option::is_none")]
    pub steam_details: Option<SteamDetails>,
}

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
