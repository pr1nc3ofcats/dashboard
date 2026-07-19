use serde::{Deserialize, Serialize};

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
    pub main_story: f64,
    pub main_plus_sides: f64,
    pub completionist: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct SteamGridDbData {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub img_hero: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub img_steam_horizontal: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct SteamDetails {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub screeenshots: Option<Vec<String>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub detailed_description: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub release_date: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub developers: Option<Vec<String>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub publishers: Option<Vec<String>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub pc_requirements: Option<Requirements>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub linux_requirements: Option<Requirements>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub achievements: Option<Vec<Achievement>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Application {
    pub id: u64,
    pub title: String,
    pub command: Vec<String>,
    pub img_square: String,
    pub categories: Vec<String>,
    pub playtime: u64,

    // dayjs().toDate()
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_launched: Option<chrono::DateTime<chrono::Utc>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub data_path: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub steam_details: Option<SteamDetails>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub how_long_to_beat: Option<HowLongToBeat>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub steam_drid_db_data: Option<SteamGridDbData>, 
}