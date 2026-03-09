import { create } from 'zustand';

interface ReportFormState {
  title: string;
  description: string;
  category: string;
  urgency: string;
  city: string;
  area: string;
  placeName: string;
  files: File[];

  setField: (field: string, value: string) => void;
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  reset: () => void;

  /** Builds a FormData object ready for API submission. */
  toFormData: () => FormData;
}

const initialState = {
  title: '',
  description: '',
  category: '',
  urgency: '',
  city: '',
  area: '',
  placeName: '',
  files: [] as File[],
};

export const useReportStore = create<ReportFormState>((set, get) => ({
  ...initialState,

  setField: (field, value) => set({ [field]: value }),

  setFiles: (files) => set({ files }),

  addFile: (file) => set((state) => ({ files: [...state.files, file] })),

  removeFile: (index) =>
    set((state) => ({
      files: state.files.filter((_, i) => i !== index),
    })),

  reset: () => set(initialState),

  toFormData: () => {
    const state = get();
    const formData = new FormData();

    formData.append('title', state.title);
    formData.append('description', state.description);
    formData.append('category', state.category);
    formData.append('urgency', state.urgency);
    formData.append('city', state.city);
    formData.append('area', state.area);

    if (state.placeName) {
      formData.append('place_name', state.placeName);
    }

    state.files.forEach((file) => {
      formData.append('media', file);
    });

    return formData;
  },
}));
