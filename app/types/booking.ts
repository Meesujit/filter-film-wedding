
export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  eventType: string;
  eventName: string;
  date: string;
  venue: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  assignedTeam?: string[];
  createdAt: string;
}