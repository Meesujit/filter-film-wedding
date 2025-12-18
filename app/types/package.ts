export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  deliverables: string[];
  preview: string;
  duration: string;
  popular?: boolean;
  createdAt: string;
  updatedAt: string;
}
