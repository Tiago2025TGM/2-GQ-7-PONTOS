import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface UIStore {
  toastMessage: string | null;
  toastType: ToastType | null;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  toastMessage: null,
  toastType: null,

  showToast: (message, type = 'info') => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => set({ toastMessage: null, toastType: null }), 3000);
  },

  hideToast: () => set({ toastMessage: null, toastType: null }),
}));
