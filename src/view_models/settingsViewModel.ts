import { ref } from "vue";

export const tabs = ['Personalization', 'Audio', 'Utils'] as const;
export type TabType = typeof tabs[number];

export const currentTab = ref<TabType>('Personalization');