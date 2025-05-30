import { create, StateCreator } from 'zustand';
import { Drug, DrugInteraction } from '@/types/drug';
import { drugService } from '@/services/drugService';

interface DrugStore {
  // State
  selectedDrugs: Drug[];
  interactions: DrugInteraction[];
  searchResults: Drug[];
  isLoading: boolean;
  error: string | null;

  // Actions
  selectDrug: (drug: Drug) => void;
  removeDrug: (drugId: string) => void;
  searchDrugs: (query: string) => Promise<void>;
  checkInteractions: () => Promise<void>;
  clearSelection: () => void;
  setError: (error: string | null) => void;
}

const createDrugStore: StateCreator<DrugStore> = (set, get) => ({
  // Initial state
  selectedDrugs: [],
  interactions: [],
  searchResults: [],
  isLoading: false,
  error: null,

  // Actions
  selectDrug: (drug: Drug) => {
    set((state: DrugStore) => {
      if (state.selectedDrugs.length >= 2) {
        return state;
      }
      if (state.selectedDrugs.some((d: Drug) => d.id === drug.id)) {
        return state;
      }
      return { ...state, selectedDrugs: [...state.selectedDrugs, drug] };
    });
  },

  removeDrug: (drugId: string) => {
    set((state: DrugStore) => ({
      ...state,
      selectedDrugs: state.selectedDrugs.filter((d: Drug) => d.id !== drugId),
      interactions: [] // Clear interactions when removing a drug
    }));
  },

  searchDrugs: async (query: string) => {
    try {
      set({ isLoading: true, error: null } as Partial<DrugStore>);
      const result = await drugService.searchDrugs(query);
      set({ searchResults: result.drugs, isLoading: false } as Partial<DrugStore>);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while searching drugs',
        isLoading: false 
      } as Partial<DrugStore>);
    }
  },

  checkInteractions: async () => {
    const { selectedDrugs } = get();
    if (selectedDrugs.length !== 2) return;

    try {
      set({ isLoading: true, error: null } as Partial<DrugStore>);
      const interaction = await drugService.checkInteraction(
        selectedDrugs[0].id,
        selectedDrugs[1].id
      );
      set({ 
        interactions: interaction ? [interaction] : [],
        isLoading: false 
      } as Partial<DrugStore>);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while checking interactions',
        isLoading: false 
      } as Partial<DrugStore>);
    }
  },

  clearSelection: () => {
    set({ selectedDrugs: [], interactions: [], error: null } as Partial<DrugStore>);
  },

  setError: (error: string | null) => {
    set({ error } as Partial<DrugStore>);
  }
});

export const useDrugStore = create(createDrugStore); 