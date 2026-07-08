import { ref } from "vue"

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

export function updateResolution() {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
}

export function scaleH(v: number): string {
    return (v * (windowHeight.value / 1080)) + "px";
}

export function scaleW(v: number): string {
    return (v * (windowWidth.value / 1920)) + "px";
}

export function scale(v: number): string {
    const avg = ((windowWidth.value / 1920) + (windowHeight.value / 1080)) / 2;
    return (v * avg) + "px";
}