import { ApiClient } from '@/lib/api-client';

export interface AdminStats {
  totalEquipment: number;
  operationalEquipment: number;
  totalMaintenances: number;
  pendingMaintenances: number;
  totalUsers: number;
}

export const adminService = {
  async getApprovals() {
    return ApiClient.get('/admin/approvals');
  },

  async approveMaintenance(maintenanceId: string) {
    return ApiClient.post(`/admin/approve/${maintenanceId}`, {});
  },

  async rejectMaintenance(maintenanceId: string, reason: string) {
    return ApiClient.post(`/admin/reject/${maintenanceId}`, { reason });
  },

  async getUsers() {
    return ApiClient.get('/admin/users');
  },

  async updateUserRole(userId: string, role: 'admin' | 'technician' | 'operator') {
    return ApiClient.put(`/admin/users/${userId}/role`, { role });
  },

  async getStats(): Promise<AdminStats> {
    return ApiClient.get('/admin/stats');
  },
};
