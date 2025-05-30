import axios from 'axios';
import { Drug, DrugInteraction, SearchResult } from '@/types/drug';

const API_BASE_URL = '/api';

export const drugService = {
  async searchDrugs(query: string, page: number = 1, pageSize: number = 10): Promise<SearchResult> {
    const response = await axios.get(`${API_BASE_URL}/drugs/search`, {
      params: { query, page, pageSize }
    });
    return response.data;
  },

  async getDrugById(id: string): Promise<Drug> {
    const response = await axios.get(`${API_BASE_URL}/drugs/${id}`);
    return response.data;
  },

  async getDrugInteractions(drugId: string): Promise<DrugInteraction[]> {
    const response = await axios.get(`${API_BASE_URL}/drugs/${drugId}/interactions`);
    return response.data;
  },

  async checkInteraction(drug1Id: string, drug2Id: string): Promise<DrugInteraction | null> {
    const response = await axios.get(`${API_BASE_URL}/interactions/check`, {
      params: { drug1Id, drug2Id }
    });
    return response.data;
  }
}; 