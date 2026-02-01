// ============================================
// TYPES FOR SCIENCE WITH KALANA LMS
// ============================================

// Student Types
export interface Student {
  id: string; // SK-2026-0001 format
  fullName: string;
  mobileNumber: string;
  email?: string;
  grade: number;
  password: string;
  bankSlipUrl?: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  isActive: boolean;
}

// Class/Course Types
export interface Class {
  id: string;
  grade: number;
  name: string;
  nameSinhala: string;
  description: string;
  descriptionSinhala: string;
  price: number;
  type: 'monthly' | 'special';
  isActive: boolean;
  lessons: Lesson[];
  enrolledStudents: string[]; // Student IDs
  createdAt: string;
}

// Lesson Types
export interface Lesson {
  id: string;
  classId: string;
  title: string;
  titleSinhala: string;
  description: string;
  youtubeUrl: string;
  duration: string;
  order: number;
  isActive: boolean;
}

// Paper/Marks Types
export interface Paper {
  id: string;
  classId: string;
  name: string;
  maxMarks: number;
  studentMarks: StudentMark[];
  createdAt: string;
}

export interface StudentMark {
  studentId: string;
  marks: number;
}

// Payment Types
export interface Payment {
  id: string;
  studentId: string;
  classId: string;
  amount: number;
  method: 'payhere' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed';
  bankSlipUrl?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

// Notice Types
export interface Notice {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'urgent' | 'payment';
  createdAt: string;
  expiresAt?: string;
}

// Live Schedule Types
export interface LiveClass {
  id: string;
  classId: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  meetingLink?: string;
  isActive: boolean;
}

// User Context Types
export interface UserContextType {
  currentUser: Student | null;
  isAdmin: boolean;
  login: (studentId: string, password: string) => boolean;
  adminLogin: (username: string, password: string) => boolean;
  logout: () => void;
  register: (student: Omit<Student, 'id' | 'registeredAt' | 'paymentStatus' | 'isActive'>) => string;
}

// Admin Types
export interface AdminStats {
  totalStudents: number;
  activeClasses: number;
  totalRevenue: number;
  pendingPayments: number;
}
