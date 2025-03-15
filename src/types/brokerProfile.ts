export interface BrokerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  creci: string;
  status: 'active' | 'inactive' | 'deleted';
  regions: string[];
  neighborhoods: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
