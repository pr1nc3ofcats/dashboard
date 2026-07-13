type Callback = () => void;

let onAppSetupCallbacks: Callback[] = [];
let onBeforeAppMountCallbacks: Callback[] = [];
let onAfterAppMountCallbacks: Callback[] = [];
let onWindowFocusCallbacks: Callback[] = [];
let onWindowUnfocusCallbacks: Callback[] = [];

export function onAppSetup(f: Callback) {
    onAppSetupCallbacks.push(f);
}
export function onBeforeAppMount(f: Callback) {
    onBeforeAppMountCallbacks.push(f);
}
export function onAfterAppMount(f: Callback) {
    onAfterAppMountCallbacks.push(f);
}
export function onWindowFocus(f: Callback) {
    onWindowFocusCallbacks.push(f);
}
export function onWindowUnfocus(f: Callback) {
    onWindowUnfocusCallbacks.push(f);
}

export function execOnAppSetup() {
    onAppSetupCallbacks.forEach((f) => f())
}
export function execOnBeforeAppMount() {
    onBeforeAppMountCallbacks.forEach((f) => f())
}
export function execOnAfterAppMount() {
    onAfterAppMountCallbacks.forEach((f) => f())
}
export function execOnWindowFocus() {
    onWindowFocusCallbacks.forEach((f) => f())
}
export function execOnWindowUnfocus() {
    onWindowUnfocusCallbacks.forEach((f) => f())
}