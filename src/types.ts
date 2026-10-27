export type UserRole = 'admin' | 'reporter';

export interface AuthUser {
  role: UserRole;
  email: string;
  name?: string;
  loggedInAt: string;
}

export type ActionCategory = 'download' | 'create' | 'edit' | 'load_news' | 'login' | 'ad_rotate' | 'schedule_send' | 'other';

export interface AuditLogItem {
  id: string;
  reporterEmail: string;
  role: UserRole;
  action: string;
  actionType: ActionCategory;
  headline?: string;
  details?: string;
  timestamp: string;
  date: string;
  metadata?: Record<string, any>;
}

export interface AdBanner {
  id: string;
  name: string;
  desc: string;
  image: string;
  localFallback?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  dept: string;
  blood: string;
  phone: string;
  validity: string;
  photo: string;
}

export interface WpPost {
  id: number;
  cleanTitle: string;
  featuredImage: string;
  category: string;
  date: string;
  bengaliDate: string;
  link: string;
}
