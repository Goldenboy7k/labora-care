import { ApiClient } from '@/lib/api-client';
import { Maintenance } from '@/models/types';

export const maintenanceService = {
  async getAll(filters?: { status?: string; lab_id?: string; equipment_id?: string }): Promise<Maintenance[]> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.lab_id) queryParams.append('lab_id', filters.lab_id);
    if (filters?.equipment_id) queryParams.append('equipment_id', filters.equipment_id);

    const endpoint = `/maintenance${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return ApiClient.get(endpoint);
  },

  async getById(id: string): Promise<Maintenance> {
    return ApiClient.get(`/maintenance/${id}`);
  },

  async create(data: {
    equipment_id: string;
    equipment_name: string;
    lab_id: string;
    type: 'preventiva' | 'corretiva';
    scheduled_date: string;
    description?: string;
    responsible?: string;
  }): Promise<Maintenance> {
    return ApiClient.post('/maintenance', data);
  },

  async update(
    id: string,
    data: {
      status?: string;
      completed_date?: string;
      description?: string;
    }
  ): Promise<Maintenance> {
    return ApiClient.put(`/maintenance/${id}`, data);
  },

  async delete(id: string) {
    return ApiClient.delete(`/maintenance/${id}`);
  },
};
