use std::collections::HashMap;
use std::process::Command;
use std::sync::Mutex;
use std::time::{Duration, Instant};
use windows::Win32::Foundation::{BOOL, HWND, LPARAM};
use windows::Win32::UI::WindowsAndMessaging::{
    EnumWindows, GetWindowThreadProcessId, IsWindowVisible, GetWindowTextLengthW,
    ShowWindow, SetForegroundWindow, SW_RESTORE, IsIconic,
};

struct FindWindowData {
    pid: u32,
    hwnd: Option<HWND>,
}

extern "system" fn enum_windows_proc(hwnd: HWND, lparam: LPARAM) -> BOOL {
    unsafe {
        let data = &mut *(lparam.0 as *mut FindWindowData);

        let mut process_id: u32 = 0;
        GetWindowThreadProcessId(hwnd, Some(&mut process_id));

        if process_id == data.pid
            && IsWindowVisible(hwnd).as_bool()
            && GetWindowTextLengthW(hwnd) > 0
        {
            data.hwnd = Some(hwnd);
            return BOOL(0); // stop enumeration
        }
        BOOL(1) // continue
    }
}

fn find_main_window(pid: u32) -> Option<HWND> {
    let mut data = FindWindowData { pid, hwnd: None };
    unsafe {
        let _ = EnumWindows(
            Some(enum_windows_proc),
            LPARAM(&mut data as *mut _ as isize),
        );
    }
    data.hwnd
}

fn focus_window(hwnd: HWND) {
    unsafe {
        if IsIconic(hwnd).as_bool() {
            let _ = ShowWindow(hwnd, SW_RESTORE);
        }
        let _ = SetForegroundWindow(hwnd);
    }
}

fn try_focus_with_timeout(pid: u32, timeout: Duration) -> Result<(), String> {
    let start = Instant::now();
    loop {
        if let Some(hwnd) = find_main_window(pid) {
            focus_window(hwnd);
            return Ok(());
        }
        if start.elapsed() > timeout {
            return Err(String::from("timeout"));
        }
        std::thread::sleep(Duration::from_millis(100));
    }
}

#[derive(Default)]
pub struct RunningProcesses {
    data: HashMap<Vec<String>, u32>
}

#[tauri::command(rename_all = "snake_case")]
pub fn try_spawn_detached(state: tauri::State<Mutex<RunningProcesses>>, cmd: Vec<String>) -> Result<(), String> {
    if cmd.is_empty() {
        return Err(String::from("Empty command provided"));
    }

    let proc = Command::new(cmd.get(0).unwrap())
        .args(&cmd[1..])
        .spawn()
        .map_err(|err| err.to_string())?;

    state.lock().unwrap().data.insert(cmd, proc.id());

    let _ = try_focus_with_timeout(proc.id(), Duration::from_secs(20));

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn try_focuse_window(state: tauri::State<Mutex<RunningProcesses>>, cmd: Vec<String>) -> Result<(), String> {
    let procs = &mut state.lock().unwrap().data;
    if !procs.contains_key(&cmd) {
        return Err(String::from("process is not running"));
    }

    if let Err(err) = try_focus_with_timeout(*procs.get(&cmd).unwrap(), Duration::from_secs(5)) {
        procs.remove(&cmd);
        return Err(err);
    }

    Ok(())
}