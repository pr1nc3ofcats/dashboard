import { ref } from "vue";
import { SgdbImage } from "../../services/api/steamGridDb";

export const items = ref<SgdbImage[]>([]);
export const showSgdbModal = ref(false);

let resolvePromise: ((image: SgdbImage | null) => void) | null = null;

export function useSgdbModal(images: SgdbImage[]): Promise<SgdbImage | null> {
  items.value = images;
  showSgdbModal.value = true;

  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

export function resolveSgdbModal(image: SgdbImage | null) {
  showSgdbModal.value = false;
  resolvePromise?.(image);
  resolvePromise = null;
}