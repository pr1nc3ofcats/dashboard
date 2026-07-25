import { ref } from "vue";
import { Settings, SettingsData } from "../models/settings";
import { useExplorerModal } from "./modals/fileSelectionModalViewModel";

export const tabs = ['Personalization', 'Audio', 'Utils'] as const;
export type TabType = typeof tabs[number];

export const currentTab = ref<TabType>('Personalization');

export const shouldShowExplorer = ref(false);
export const selectOptionFromFs = async (prop: keyof SettingsData) => {
    const result = await useExplorerModal(shouldShowExplorer, () => shouldShowExplorer.value = false);
    if (result) Settings.set(prop, result);
}