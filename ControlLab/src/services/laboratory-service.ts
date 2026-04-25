import { ApiClient } from '@/lib/api-client';
import { Laboratory } from '@/models/types';
import { laboratories as mockLaboratories } from '@/data/mockData';

export const laboratoryService = {
  async getAll(): Promise<Laboratory[]> {
    try {
      return await ApiClient.get('/laboratories');
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      return mockLaboratories;
    }
  },

  async getById(id: string): Promise<Laboratory> {
    try {
      return await ApiClient.get(`/laboratories/${id}`);
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      const lab = mockLaboratories.find(l => l.id === id);
      if (!lab) throw new Error('Laboratory not found');
      return lab;
    }
  },

  async create(name: string, icon: string): Promise<Laboratory> {
    try {
      return await ApiClient.post('/laboratories', { name, icon });
    } catch (error) {
      console.warn('API not available, cannot create laboratory:', error);
      throw error;
    }
  },

  async update(id: string, name: string, icon: string): Promise<Laboratory> {
    try {
      return await ApiClient.put(`/laboratories/${id}`, { name, icon });
    } catch (error) {
      console.warn('API not available, cannot update laboratory:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      return await ApiClient.delete(`/laboratories/${id}`);
    } catch (error) {
      console.warn('API not available, cannot delete laboratory:', error);
      throw error;
    }
  },
};
