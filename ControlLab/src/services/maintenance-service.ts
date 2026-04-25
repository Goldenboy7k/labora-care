import { ApiClient } from '@/lib/api-client';
import { Maintenance } from '@/models/types';
import { maintenances as mockMaintenances } from '@/data/mockData';

export const maintenanceService = {
  async getAll(filters?: { status?: string; lab_id?: string; equipment_id?: string }): Promise<Maintenance[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.lab_id) queryParams.append('lab_id', filters.lab_id);
      if (filters?.equipment_id) queryParams.append('equipment_id', filters.equipment_id);

      const endpoint = `/maintenance${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      return await ApiClient.get(endpoint);
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      // Filter mock data based on filters
      let filtered = mockMaintenances;
      if (filters?.status) {
        filtered = filtered.filter(m => m.status === filters.status);
      }
      if (filters?.lab_id) {
        filtered = filtered.filter(m => m.lab_id === filters.lab_id);
      }
      if (filters?.equipment_id) {
        filtered = filtered.filter(m => m.equipment_id === filters.equipment_id);
      }
      return filtered;
    }
  },

  async getById(id: string): Promise<Maintenance> {
    try {
      return await ApiClient.get(`/maintenance/${id}`);
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      const maint = mockMaintenances.find(m => m.id === id);
      if (!maint) throw new Error('Maintenance not found');
      return maint;
    }
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
    try {
      return await ApiClient.post('/maintenance', data);
    } catch (error) {
      console.warn('API not available, cannot create maintenance:', error);
      throw error;
    }
  },

  async update(
    id: string,
    data: {
      status?: string;
      completed_date?: string;
      description?: string;
    }
  ): Promise<Maintenance> {
    try {
      return await ApiClient.put(`/maintenance/${id}`, data);
    } catch (error) {
      console.warn('API not available, cannot update maintenance:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      return await ApiClient.delete(`/maintenance/${id}`);
    } catch (error) {
      console.warn('API not available, cannot delete maintenance:', error);
      throw error;
    }
  },
};
