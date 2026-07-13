import { computed, ref } from "vue"
import { onAfterAppMount } from "./dependencyInjector";

// Consts
export const solidBgColor = "#1A191C";

// Pulse
export function performPulse(event: any) {
    const el = event.currentTarget;
    el.classList.add('pulse-active', 'pulse-down');

    setTimeout(() => {
        el.classList.remove('pulse-down');
        setTimeout(() => {
            el.classList.remove('pulse-active');
        }, 100);
    }, 100);
}

// Scaling
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

onAfterAppMount(() => {
    window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth;
        windowHeight.value = window.innerHeight;
    });
});

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

// For absolutely placed page content
export const contentHeight = computed(() => {
    const scalingFactor = windowHeight.value / 1080;
    const headerMargin = scalingFactor * 75;
    const headerHeight = scalingFactor * 60;
    const marginFromHeader = scalingFactor * 50;
    return (windowHeight.value - headerHeight - headerMargin - marginFromHeader) + "px"
});