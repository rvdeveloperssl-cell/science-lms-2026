// ============================================
// DATA STORE FOR SCIENCE WITH KALANA LMS
// Frontend simulation with localStorage persistence
// ============================================

import type { Student, Class, Lesson, Paper, Payment, Notice, LiveClass } from '@/types';

// ============================================
// INITIAL DATA
// ============================================

const initialClasses: Class[] = [
  {
    id: 'cls-6-001',
    grade: 6,
    name: 'Grade 6 Science - Monthly',
    nameSinhala: '6 ශ්‍රේණිය විද්‍යාව - මාසික',
    description: 'Comprehensive science education for Grade 6 students covering all syllabus topics',
    descriptionSinhala: '6 ශ්‍රේණියේ සිසුන් සඳහා සම්පූර්ණ විද්‍යා අධ්‍යාපනය - සියලුම පාඩම් ආවරණය කරමින්',
    price: 1500,
    type: 'monthly',
    isActive: true,
    lessons: [
      {
        id: 'les-6-001-1',
        classId: 'cls-6-001',
        title: 'Introduction to Science',
        titleSinhala: 'විද්‍යාවට හඳුන්වාදීම',
        description: 'Basic concepts and scientific method',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '45 min',
        order: 1,
        isActive: true
      },
      {
        id: 'les-6-001-2',
        classId: 'cls-6-001',
        title: 'Living and Non-living Things',
        titleSinhala: 'ජීවී හා අජීවී දේ',
        description: 'Characteristics of living organisms',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '50 min',
        order: 2,
        isActive: true
      }
    ],
    enrolledStudents: [],
    createdAt: '2026-01-01'
  },
  {
    id: 'cls-7-001',
    grade: 7,
    name: 'Grade 7 Science - Monthly',
    nameSinhala: '7 ශ්‍රේණිය විද්‍යාව - මාසික',
    description: 'Advanced science concepts for Grade 7 with practical experiments',
    descriptionSinhala: '7 ශ්‍රේණිය සඳහා උසස් විද්‍යා සංකල්ප - ප්‍රායෝගික පර්යේෂණ සමඟ',
    price: 1800,
    type: 'monthly',
    isActive: true,
    lessons: [],
    enrolledStudents: [],
    createdAt: '2026-01-01'
  },
  {
    id: 'cls-8-001',
    grade: 8,
    name: 'Grade 8 Science - Monthly',
    nameSinhala: '8 ශ්‍රේණිය විද්‍යාව - මාසික',
    description: 'Comprehensive coverage of Grade 8 science syllabus',
    descriptionSinhala: '8 ශ්‍රේණිය විද්‍යා පාඩම් පද්ධතිය සම්පූර්ණයෙන් ආවරණය කරමින්',
    price: 2000,
    type: 'monthly',
    isActive: true,
    lessons: [],
    enrolledStudents: [],
    createdAt: '2026-01-01'
  },
  {
    id: 'cls-9-001',
    grade: 9,
    name: 'Grade 9 Science - Monthly',
    nameSinhala: '9 ශ්‍රේණිය විද්‍යාව - මාසික',
    description: 'Preparation for O/L with in-depth science learning',
    descriptionSinhala: 'සාමාන්‍ය පෙළ සඳහා සූදානම - ගැඹුරු විද්‍යා ඉගෙනුම',
    price: 2500,
    type: 'monthly',
    isActive: true,
    lessons: [],
    enrolledStudents: [],
    createdAt: '2026-01-01'
  },
  {
    id: 'cls-10-001',
    grade: 10,
    name: 'Grade 10 Science - O/L Prep',
    nameSinhala: '10 ශ්‍රේණිය විද්‍යාව - සා.පෙළ සූදානම',
    description: 'Intensive O/L preparation with past paper discussions',
    descriptionSinhala: 'පසුගිය ප්‍රශ්න පත්‍ර සාකච්ඡා සමඟ දැඩි සා.පෙළ සූදානම',
    price: 3000,
    type: 'monthly',
    isActive: true,
    lessons: [],
    enrolledStudents: [],
    createdAt: '2026-01-01'
  },
  {
    id: 'cls-11-001',
    grade: 11,
    name: 'Grade 11 Science - O/L Final',
    nameSinhala: '11 ශ්‍රේණිය විද්‍යාව - සා.පෙළ අවසාන',
    description: 'Final year O/L preparation with comprehensive revision',
    descriptionSinhala: 'සම්පූර්ණ නැවත සංස්කරණය සමඟ අවසාන වසර සා.පෙළ සූදානම',
    price: 3500,
    type: 'monthly',
    isActive: true,
    lessons: [],
    enrolledStudents: [],
    createdAt: '2026-01-01'
  },
  {
    id: 'cls-sp-001',
    grade: 10,
    name: 'Special O/L Revision Group',
    nameSinhala: 'විශේෂ සා.පෙළ නැවත සංස්කරණ කණ්ඩායම',
    description: 'Intensive 3-month revision program for O/L students',
    descriptionSinhala: 'සා.පෙළ සිසුන් සඳහා දැඩි මාස 3 නැවත සංස්කරණ වැඩසටහන',
    price: 8000,
    type: 'special',
    isActive: true,
    lessons: [],
    enrolledStudents: [],
    createdAt: '2026-01-01'
  },
  {
    id: 'cls-sp-002',
    grade: 11,
    name: 'O/L Model Paper Class',
    nameSinhala: 'සා.පෙළ නමුණා ප්‍රශ්න පත්‍ර පන්තිය',
    description: 'Weekly model paper discussions and exam techniques',
    descriptionSinhala: 'සතිපතා නමුණා ප්‍රශ්න පත්‍ර සාකච්ඡා සහ විභාග ක්‍රම',
    price: 5000,
    type: 'special',
    isActive: true,
    lessons: [],
    enrolledStudents: [],
    createdAt: '2026-01-01'
  }
];

const initialNotices: Notice[] = [
  {
    id: 'not-001',
    title: 'Welcome to Science with Kalana!',
    message: 'New classes starting from February 2026. Register now!',
    type: 'general',
    createdAt: '2026-01-15',
    expiresAt: '2026-03-01'
  },
  {
    id: 'not-002',
    title: 'O/L Special Batch Registration Open',
    message: 'Limited seats available for Grade 10-11 special revision classes',
    type: 'urgent',
    createdAt: '2026-01-20',
    expiresAt: '2026-02-15'
  }
];

const initialLiveClasses: LiveClass[] = [
  {
    id: 'live-001',
    classId: 'cls-10-001',
    title: 'O/L Physics Fundamentals',
    date: '2026-02-05',
    time: '18:00',
    duration: '2 hours',
    meetingLink: 'https://zoom.us/j/example',
    isActive: true
  },
  {
    id: 'live-002',
    classId: 'cls-11-001',
    title: 'Chemistry Revision - Acids & Bases',
    date: '2026-02-07',
    time: '16:00',
    duration: '1.5 hours',
    meetingLink: 'https://zoom.us/j/example2',
    isActive: true
  }
];

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  STUDENTS: 'sk_students',
  CLASSES: 'sk_classes',
  PAPERS: 'sk_papers',
  PAYMENTS: 'sk_payments',
  NOTICES: 'sk_notices',
  LIVE_CLASSES: 'sk_live_classes',
  CURRENT_USER: 'sk_current_user',
  IS_ADMIN: 'sk_is_admin'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// ============================================
// STUDENT OPERATIONS
// ============================================

export const generateStudentId = (): string => {
  const students = getStudents();
  const year = new Date().getFullYear();
  const count = students.length + 1;
  return `SK-${year}-${String(count).padStart(4, '0')}`;
};

export const getStudents = (): Student[] => {
  return getFromStorage(STORAGE_KEYS.STUDENTS, []);
};

export const getStudentById = (id: string): Student | undefined => {
  const students = getStudents();
  return students.find(s => s.id === id);
};

export const addStudent = (student: Omit<Student, 'id' | 'registeredAt' | 'paymentStatus' | 'isActive'>): string => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: generateStudentId(),
    registeredAt: new Date().toISOString(),
    paymentStatus: 'pending',
    isActive: true
  };
  students.push(newStudent);
  saveToStorage(STORAGE_KEYS.STUDENTS, students);
  return newStudent.id;
};

export const updateStudent = (id: string, updates: Partial<Student>): void => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
  }
};

export const deleteStudent = (id: string): void => {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  saveToStorage(STORAGE_KEYS.STUDENTS, filtered);
};

// ============================================
// CLASS OPERATIONS
// ============================================

export const getClasses = (): Class[] => {
  const classes = getFromStorage<Class[]>(STORAGE_KEYS.CLASSES, []);
  if (classes.length === 0) {
    saveToStorage(STORAGE_KEYS.CLASSES, initialClasses);
    return initialClasses;
  }
  return classes;
};

export const getClassById = (id: string): Class | undefined => {
  const classes = getClasses();
  return classes.find(c => c.id === id);
};

export const getClassesByGrade = (grade: number): Class[] => {
  const classes = getClasses();
  return classes.filter(c => c.grade === grade && c.isActive);
};

export const addClass = (classData: Omit<Class, 'id' | 'createdAt' | 'enrolledStudents'>): void => {
  const classes = getClasses();
  const newClass: Class = {
    ...classData,
    id: `cls-${Date.now()}`,
    createdAt: new Date().toISOString(),
    enrolledStudents: []
  };
  classes.push(newClass);
  saveToStorage(STORAGE_KEYS.CLASSES, classes);
};

export const updateClass = (id: string, updates: Partial<Class>): void => {
  const classes = getClasses();
  const index = classes.findIndex(c => c.id === id);
  if (index !== -1) {
    classes[index] = { ...classes[index], ...updates };
    saveToStorage(STORAGE_KEYS.CLASSES, classes);
  }
};

export const deleteClass = (id: string): void => {
  const classes = getClasses();
  const filtered = classes.filter(c => c.id !== id);
  saveToStorage(STORAGE_KEYS.CLASSES, filtered);
};

export const enrollStudentToClass = (studentId: string, classId: string): void => {
  const classes = getClasses();
  const index = classes.findIndex(c => c.id === classId);
  if (index !== -1 && !classes[index].enrolledStudents.includes(studentId)) {
    classes[index].enrolledStudents.push(studentId);
    saveToStorage(STORAGE_KEYS.CLASSES, classes);
  }
};

// ============================================
// LESSON OPERATIONS
// ============================================

export const addLesson = (lesson: Omit<Lesson, 'id'>): void => {
  const classes = getClasses();
  const classIndex = classes.findIndex(c => c.id === lesson.classId);
  if (classIndex !== -1) {
    const newLesson: Lesson = {
      ...lesson,
      id: `les-${Date.now()}`
    };
    classes[classIndex].lessons.push(newLesson);
    classes[classIndex].lessons.sort((a, b) => a.order - b.order);
    saveToStorage(STORAGE_KEYS.CLASSES, classes);
  }
};

export const updateLesson = (classId: string, lessonId: string, updates: Partial<Lesson>): void => {
  const classes = getClasses();
  const classIndex = classes.findIndex(c => c.id === classId);
  if (classIndex !== -1) {
    const lessonIndex = classes[classIndex].lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex !== -1) {
      classes[classIndex].lessons[lessonIndex] = {
        ...classes[classIndex].lessons[lessonIndex],
        ...updates
      };
      saveToStorage(STORAGE_KEYS.CLASSES, classes);
    }
  }
};

export const deleteLesson = (classId: string, lessonId: string): void => {
  const classes = getClasses();
  const classIndex = classes.findIndex(c => c.id === classId);
  if (classIndex !== -1) {
    classes[classIndex].lessons = classes[classIndex].lessons.filter(l => l.id !== lessonId);
    saveToStorage(STORAGE_KEYS.CLASSES, classes);
  }
};

// ============================================
// PAPER & MARKS OPERATIONS
// ============================================

export const getPapers = (): Paper[] => {
  return getFromStorage(STORAGE_KEYS.PAPERS, []);
};

export const getPapersByClass = (classId: string): Paper[] => {
  const papers = getPapers();
  return papers.filter(p => p.classId === classId);
};

export const addPaper = (paper: Omit<Paper, 'id' | 'createdAt'>): void => {
  const papers = getPapers();
  const newPaper: Paper = {
    ...paper,
    id: `paper-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  papers.push(newPaper);
  saveToStorage(STORAGE_KEYS.PAPERS, papers);
};

export const updateStudentMark = (paperId: string, studentId: string, marks: number): void => {
  const papers = getPapers();
  const paperIndex = papers.findIndex(p => p.id === paperId);
  if (paperIndex !== -1) {
    const markIndex = papers[paperIndex].studentMarks.findIndex(m => m.studentId === studentId);
    if (markIndex !== -1) {
      papers[paperIndex].studentMarks[markIndex].marks = marks;
    } else {
      papers[paperIndex].studentMarks.push({ studentId, marks });
    }
    saveToStorage(STORAGE_KEYS.PAPERS, papers);
  }
};

export const deletePaper = (paperId: string): void => {
  const papers = getPapers();
  const filtered = papers.filter(p => p.id !== paperId);
  saveToStorage(STORAGE_KEYS.PAPERS, filtered);
};

// ============================================
// PAYMENT OPERATIONS
// ============================================

export const getPayments = (): Payment[] => {
  return getFromStorage(STORAGE_KEYS.PAYMENTS, []);
};

export const getPaymentsByStudent = (studentId: string): Payment[] => {
  const payments = getPayments();
  return payments.filter(p => p.studentId === studentId);
};

export const getPendingPayments = (): Payment[] => {
  const payments = getPayments();
  return payments.filter(p => p.status === 'pending');
};

export const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>): string => {
  const payments = getPayments();
  const newPayment: Payment = {
    ...payment,
    id: `pay-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  payments.push(newPayment);
  saveToStorage(STORAGE_KEYS.PAYMENTS, payments);
  return newPayment.id;
};

export const updatePaymentStatus = (paymentId: string, status: Payment['status'], transactionId?: string): void => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === paymentId);
  if (index !== -1) {
    payments[index].status = status;
    if (transactionId) payments[index].transactionId = transactionId;
    if (status === 'completed') payments[index].paidAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.PAYMENTS, payments);
    
    // Auto-enroll student if payment completed
    if (status === 'completed') {
      enrollStudentToClass(payments[index].studentId, payments[index].classId);
    }
  }
};

// ============================================
// NOTICE OPERATIONS
// ============================================

export const getNotices = (): Notice[] => {
  const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);
  if (notices.length === 0) {
    saveToStorage(STORAGE_KEYS.NOTICES, initialNotices);
    return initialNotices;
  }
  return notices.filter(n => !n.expiresAt || new Date(n.expiresAt) > new Date());
};

export const addNotice = (notice: Omit<Notice, 'id' | 'createdAt'>): void => {
  const notices = getNotices();
  const newNotice: Notice = {
    ...notice,
    id: `not-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  notices.push(newNotice);
  saveToStorage(STORAGE_KEYS.NOTICES, notices);
};

export const deleteNotice = (id: string): void => {
  const notices = getNotices();
  const filtered = notices.filter(n => n.id !== id);
  saveToStorage(STORAGE_KEYS.NOTICES, filtered);
};

// ============================================
// LIVE CLASS OPERATIONS
// ============================================

export const getLiveClasses = (): LiveClass[] => {
  const liveClasses = getFromStorage<LiveClass[]>(STORAGE_KEYS.LIVE_CLASSES, []);
  if (liveClasses.length === 0) {
    saveToStorage(STORAGE_KEYS.LIVE_CLASSES, initialLiveClasses);
    return initialLiveClasses;
  }
  return liveClasses.filter(l => l.isActive);
};

export const addLiveClass = (liveClass: Omit<LiveClass, 'id'>): void => {
  const liveClasses = getLiveClasses();
  const newLiveClass: LiveClass = {
    ...liveClass,
    id: `live-${Date.now()}`
  };
  liveClasses.push(newLiveClass);
  saveToStorage(STORAGE_KEYS.LIVE_CLASSES, liveClasses);
};

export const deleteLiveClass = (id: string): void => {
  const liveClasses = getLiveClasses();
  const filtered = liveClasses.filter(l => l.id !== id);
  saveToStorage(STORAGE_KEYS.LIVE_CLASSES, filtered);
};

// ============================================
// AUTH OPERATIONS
// ============================================

export const setCurrentUser = (student: Student | null): void => {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, student);
};

export const getCurrentUser = (): Student | null => {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
};

export const setIsAdmin = (isAdmin: boolean): void => {
  saveToStorage(STORAGE_KEYS.IS_ADMIN, isAdmin);
};

export const getIsAdmin = (): boolean => {
  return getFromStorage(STORAGE_KEYS.IS_ADMIN, false);
};

// ============================================
// STATS OPERATIONS
// ============================================

export const getAdminStats = () => {
  const students = getStudents();
  const classes = getClasses();
  const payments = getPayments();
  
  return {
    totalStudents: students.length,
    activeClasses: classes.filter(c => c.isActive).length,
    totalRevenue: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').length
  };
};

// ============================================
// INITIALIZATION
// ============================================

export const initializeData = (): void => {
  // Initialize classes if empty
  const classes = getFromStorage<Class[]>(STORAGE_KEYS.CLASSES, []);
  if (classes.length === 0) {
    saveToStorage(STORAGE_KEYS.CLASSES, initialClasses);
  }
  
  // Initialize notices if empty
  const notices = getFromStorage<Notice[]>(STORAGE_KEYS.NOTICES, []);
  if (notices.length === 0) {
    saveToStorage(STORAGE_KEYS.NOTICES, initialNotices);
  }
  
  // Initialize live classes if empty
  const liveClasses = getFromStorage<LiveClass[]>(STORAGE_KEYS.LIVE_CLASSES, []);
  if (liveClasses.length === 0) {
    saveToStorage(STORAGE_KEYS.LIVE_CLASSES, initialLiveClasses);
  }
};

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
