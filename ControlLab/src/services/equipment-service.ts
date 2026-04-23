import { ApiClient } from '@/lib/api-client';
import { Equipment } from '@/models/types';

export const equipmentService = {
  async getAll(filters?: { lab_id?: string; status?: string }): Promise<Equipment[]> {
    const queryParams = new URLSearchParams();
    if (filters?.lab_id) queryParams.append('lab_id', filters.lab_id);
    if (filters?.status) queryParams.append('status', filters.status);

    const endpoint = `/equipment${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return ApiClient.get(endpoint);
  },

  async getById(id: string): Promise<Equipment> {
    return ApiClient.get(`/equipment/${id}`);
  },

  async create(data: {
    name: string;
    brand: string;
    model: string;
    serial_number: string;
    lab_id: string;
    status?: string;
    acquisition_date?: string;
  }): Promise<Equipment> {
    return ApiClient.post('/equipment', data);
  },

  async update(
    id: string,
    data: {
      name?: string;
      brand?: string;
      model?: string;
      status?: string;
      serial_number?: string;
      acquisition_date?: string;
      last_maintenance?: string;
    }
  ): Promise<Equipment> {
    return ApiClient.put(`/equipment/${id}`, data);
  },

  async delete(id: string) {
    return ApiClient.delete(`/equipment/${id}`);
  },
};
