use std::process::Command;

#[tauri::command]
pub fn get_user_name() -> Result<String, String> {
    whoami::username().map_err(|e| e.to_string())
}

#[tauri::command(rename_all = "snake_case")]
pub fn try_spawn_detached(cmd: Vec<String>) -> Result<(), String> {
    if cmd.is_empty() {
        return Err(String::from("Empty command provided"));
    }

    Command::new(cmd.get(0).unwrap())
        .args(&cmd[1..])
        .spawn()
        .map_err(|err| err.to_string())?;

    Ok(())
}
