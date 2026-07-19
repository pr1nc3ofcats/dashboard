import { invoke } from '@tauri-apps/api/core';
import { fetch } from '@tauri-apps/plugin-http';

export async function downloadResource(url: string, absolutePath: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download resource: ${response.statusText}`)
    }
    const bytes = new Uint8Array(await response.arrayBuffer());

    try {
        await invoke('save_bytes_to_file', {bytes: bytes, path: absolutePath})
    } catch (err) {
        console.error(err);
    }
}