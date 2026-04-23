import { ApiClient } from '@/lib/api-client';
import { Laboratory } from '@/models/types';

export const laboratoryService = {
  async getAll(): Promise<Laboratory[]> {
    return ApiClient.get('/laboratories');
  },

  async getById(id: string): Promise<Laboratory> {
    return ApiClient.get(`/laboratories/${id}`);
  },

  async create(name: string, icon: string): Promise<Laboratory> {
    return ApiClient.post('/laboratories', { name, icon });
  },

  async update(id: string, name: string, icon: string): Promise<Laboratory> {
    return ApiClient.put(`/laboratories/${id}`, { name, icon });
  },

  async delete(id: string) {
    return ApiClient.delete(`/laboratories/${id}`);
  },
};
