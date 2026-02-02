// ============================================
// AUTHENTICATION CONTEXT
// Manages user sessions and authentication state
// ============================================

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Student } from '@/types';
import { 
  getStudents, 
  getStudentById, 
  addStudent, 
  getCurrentUser, 
  setCurrentUser, 
  getIsAdmin, 
  setIsAdmin,
  initializeData 
} from '@/data/store';

// Export this so Login.tsx can import it
export interface RegisterData {
  fullName: string;
  mobileNumber: string;
  email?: string;
  grade: number;
  password: string;
  bankSlipUrl?: string;
  // NEW FIELDS:
  nicNumber?: string;
  gender?: string;
  parentName?: string;
  parentPhone?: string;
}

interface AuthContextType {
  currentUser: Student | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (studentId: string, password: string) => boolean;
  adminLogin: (username: string, password: string) => boolean;
  logout: () => void;
  register: (studentData: RegisterData) => { success: boolean; studentId?: string; message: string };
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials (in production, this should be server-side)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'kalana2026'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<Student | null>(null);
  const [isAdmin, setIsAdminState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    initializeData();
    const savedUser = getCurrentUser();
    const savedIsAdmin = getIsAdmin();
    
    if (savedUser) {
      // Refresh user data from storage
      const freshUser = getStudentById(savedUser.id);
      setCurrentUserState(freshUser || null);
    }
    setIsAdminState(savedIsAdmin);
    setIsLoading(false);
  }, []);

  const login = (studentId: string, password: string): boolean => {
    const student = getStudentById(studentId);
    if (student && student.password === password && student.isActive) {
      setCurrentUserState(student);
      setCurrentUser(student);
      setIsAdmin(false);
      setIsAdminState(false);
      return true;
    }
    return false;
  };

  const adminLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      setIsAdminState(true);
      setCurrentUserState(null);
      setCurrentUser(null);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setCurrentUserState(null);
    setIsAdmin(false);
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const register = (studentData: RegisterData): { success: boolean; studentId?: string; message: string } => {
    // Validate mobile number format (Sri Lankan)
    const mobileRegex = /^(07|77|76|78|75|71|70)[0-9]{7}$/;
    if (!mobileRegex.test(studentData.mobileNumber.replace(/\s/g, ''))) {
      return { success: false, message: 'Invalid mobile number format. Use 07x xxxxxxx' };
    }

    // Validate NIC format (Old: 9 digits + V/X, New: 12 digits)
    if (studentData.nicNumber) {
      const oldNicRegex = /^[0-9]{9}[vVxX]$/;
      const newNicRegex = /^[0-9]{12}$/;
      if (!oldNicRegex.test(studentData.nicNumber) && !newNicRegex.test(studentData.nicNumber)) {
        return { success: false, message: 'Invalid NIC number format' };
      }
    }

    // Check if mobile number already exists
    const existingStudents = getStudents();
    const existingMobile = existingStudents.find(s => s.mobileNumber === studentData.mobileNumber);
    if (existingMobile) {
      return { success: false, message: 'Mobile number already registered' };
    }

    // Check if NIC already exists (if provided)
    if (studentData.nicNumber) {
      const existingNic = existingStudents.find(s => s.nicNumber === studentData.nicNumber);
      if (existingNic) {
        return { success: false, message: 'NIC number already registered' };
      }
    }

    try {
      const studentId = addStudent({
        fullName: studentData.fullName,
        mobileNumber: studentData.mobileNumber,
        email: studentData.email,
        grade: studentData.grade,
        password: studentData.password,
        bankSlipUrl: studentData.bankSlipUrl,
        // NEW FIELDS:
        nicNumber: studentData.nicNumber,
        gender: studentData.gender,
        parentName: studentData.parentName,
        parentPhone: studentData.parentPhone
      });

      return { 
        success: true, 
        studentId, 
        message: 'Registration successful! Your Student ID: ' + studentId 
      };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const refreshUser = (): void => {
    if (currentUser) {
      const freshUser = getStudentById(currentUser.id);
      setCurrentUserState(freshUser || null);
      setCurrentUser(freshUser || null);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      isLoading,
      login,
      adminLogin,
      logout,
      register,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
