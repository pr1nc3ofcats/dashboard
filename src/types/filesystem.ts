interface DirEntry {
    name: string;
    modified: Date;
    size: number;
    is_dir: boolean;
}

interface Volume {
    name: string,
    mount_point: string,
    is_removable: boolean,
}

interface Places {
    home: string;
    desktop: string;
    documents: string;
    download: string;
    videos: string;
    pictures: string;
    music: string;
    volumes: Volume[];
}