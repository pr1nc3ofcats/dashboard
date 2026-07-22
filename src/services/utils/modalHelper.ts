export function grabFocus(rootElement: any, spatialNavigation: any) {
    spatialNavigation.focus("modal-frame");
    spatialNavigation.set({
        navigableFilter: (el) => rootElement.value?.contains(el) ?? false
    });
}

export function releaseFocus(spatialNavigation: any) {
    spatialNavigation.set({ navigableFilter: null });
    spatialNavigation.focus();
}