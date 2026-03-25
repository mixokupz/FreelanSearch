export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer' | 'admin';
  avatar?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  joinedDate?: string;
  location?: string;
  languages?: string[];
}

export interface Service {
  id: string;
  freelancerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number; // в днях
  images?: string[];
  tags?: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  freelancerId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  serviceId?: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Deal {
  id: string;
  clientId: string;
  freelancerId: string;
  serviceId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'disputed';
  amount: number;
  createdAt: string;
  completedAt?: string;
}
