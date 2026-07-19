use std::path::PathBuf;

pub mod space;
pub mod places;
pub mod enumeration;
pub mod crud_operations;

fn clean_path(p: &PathBuf) -> String {
    let p = p.canonicalize().unwrap();
    let mut str = p.to_str().unwrap();
    str = str.strip_prefix("\\\\?\\").unwrap_or(str);
    str = str.strip_suffix("\\").unwrap_or(str);
    str.replace("\\", "/")
}
