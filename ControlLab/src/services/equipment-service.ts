import { ApiClient } from '@/lib/api-client';
import { Equipment } from '@/models/types';
import { equipment as mockEquipment } from '@/data/mockData';

// Local copy for mock operations
let localEquipment = [...mockEquipment];

export const equipmentService = {
  async getAll(filters?: { lab_id?: string; status?: string }): Promise<Equipment[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.lab_id) queryParams.append('lab_id', filters.lab_id);
      if (filters?.status) queryParams.append('status', filters.status);

      const endpoint = `/equipment${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      return await ApiClient.get(endpoint);
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      // Filter mock data based on filters
      let filtered = localEquipment;
      if (filters?.lab_id) {
        filtered = filtered.filter(eq => eq.lab_id === filters.lab_id);
      }
      if (filters?.status) {
        filtered = filtered.filter(eq => eq.status === filters.status);
      }
      return filtered;
    }
  },

  async getById(id: string): Promise<Equipment> {
    try {
      return await ApiClient.get(`/equipment/${id}`);
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      const eq = localEquipment.find(e => e.id === id);
      if (!eq) throw new Error('Equipment not found');
      return eq;
    }
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
    try {
      return await ApiClient.post('/equipment', data);
    } catch (error) {
      console.warn('API not available, using mock data for create:', error);
      // Create a new equipment with mock data
      const newEquipment: Equipment = {
        id: `eq-${Date.now()}`,
        name: data.name,
        brand: data.brand,
        model: data.model,
        serial_number: data.serial_number,
        lab_id: data.lab_id,
        status: data.status || 'operacional',
        acquisition_date: data.acquisition_date || new Date().toISOString().split('T')[0],
        last_maintenance: null,
      };
      // Add to local equipment array
      localEquipment.push(newEquipment);
      return newEquipment;
    }
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
    try {
      return await ApiClient.put(`/equipment/${id}`, data);
    } catch (error) {
      console.warn('API not available, using mock data for update:', error);
      // Find and update the equipment in mock data
      const eq = localEquipment.find(e => e.id === id);
      if (!eq) throw new Error('Equipment not found');
      
      // Update the equipment with new data
      Object.assign(eq, data);
      return eq;
    }
  },

  async delete(id: string) {
    try {
      return await ApiClient.delete(`/equipment/${id}`);
    } catch (error) {
      console.warn('API not available, using mock data for delete:', error);
      // Find and remove the equipment from mock data
      const index = localEquipment.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Equipment not found');
      
      localEquipment.splice(index, 1);
      return { success: true };
    }
  },
};
