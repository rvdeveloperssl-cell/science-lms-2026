// ============================================

// ADMIN DASHBOARD

// Full admin control panel

// ============================================



import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, BookOpen, CreditCard, Bell, Plus, Trash2, 
  CheckCircle, XCircle, TrendingUp, Search, Calendar,
  Video, FileText, Link as LinkIcon, Clock,
  ChevronDown, ChevronUp, Download, Unlock, ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getAdminStats, getStudents, getClasses, getPayments, 
  getNotices, addNotice, deleteNotice, updatePaymentStatus,
  addClass, addLesson, addPaper, getStudentById,
  addLiveClass, getLiveClasses
} from '@/data/store';
import type { Student, Class, Payment, Notice, LiveClass } from '@/types';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

type ExtendedClass = Class & {
  month?: string;
  pdfs?: any[];
  recordings?: any[];
  zoomLinks?: any[];
  lessons?: any[];
};

type ExtendedLiveClass = LiveClass & {
  scheduledAt?: string;
  zoomLink?: string;
  enrolledOnly?: boolean;
  grade?: number;
  duration?: string;
  title?: string;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalStudents: 0, activeClasses: 0, totalRevenue: 0, pendingPayments: 0 });
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [liveClasses, setLiveClasses] = useState<ExtendedLiveClass[]>([]);
  
  // Refs for scrolling to forms
  const formRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  
  // Single state to track which form is active (instead of multiple booleans)
  const [activeForm, setActiveForm] = useState<string | null>(null);
  
  // Selected data
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [studentStats, setStudentStats] = useState<any>(null);
  const [contentType, setContentType] = useState<'pdf' | 'recording' | 'zoom' | 'tutorial'>('pdf');
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (isAdmin) {
      refreshData();
    }
  }, [isAdmin]);

  const refreshData = () => {
    setStats(getAdminStats());
    setStudents(getStudents());
    setClasses(getClasses());
    setPayments(getPayments());
    setNotices(getNotices());
    setLiveClasses(getLiveClasses() as ExtendedLiveClass[]);
  };

  // Auto-scroll to form when it opens
  useEffect(() => {
    if (activeForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeForm]);

  if (!isAdmin) {
    return (
      <section className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h3>
          <p className="text-gray-500 mb-4">Admin login required</p>
          <button onClick={() => onNavigate('login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  const handleViewStudent = (studentId: string) => {
    const student = getStudentById(studentId);
    if (student) {
      setSelectedStudent(student);
      const stats = {
        totalLogins: 15,
        lastActive: new Date().toLocaleDateString(),
        totalWatchTime: 24,
        papersCount: 5,
        expiredClasses: []
      };
      setStudentStats(stats);
      setActiveForm('profile');
    }
  };

  const handleActivateStudent = (studentId: string) => {
    console.log('Activating student:', studentId);
    refreshData();
    if (selectedStudent?.id === studentId) {
      setSelectedStudent({ ...selectedStudent, isActive: true });
    }
  };

  const handleApprovePayment = (paymentId: string) => {
    updatePaymentStatus(paymentId, 'completed');
    refreshData();
  };

  const handleRejectPayment = (paymentId: string) => {
    updatePaymentStatus(paymentId, 'failed');
    refreshData();
  };

  const handleAddClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const month = formData.get('month') as string;
    
    const classData: any = {
      grade: Number(formData.get('grade')),
      name: formData.get('name') as string,
      nameSinhala: formData.get('nameSinhala') as string,
      description: formData.get('description') as string,
      descriptionSinhala: formData.get('descriptionSinhala') as string,
      price: Number(formData.get('price')),
      type: formData.get('type') as 'monthly' | 'special',
      isActive: true,
      lessons: []
    };

    if (month) {
      classData.month = month;
    }
    
    addClass(classData);
    setActiveForm(null);
    refreshData();
  };

  const handleAddContent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    console.log('Adding content:', {
      classId: formData.get('classId'),
      month: formData.get('contentMonth'),
      title: formData.get('title'),
      type: contentType,
      url: formData.get('url'),
      unit: formData.get('unit')
    });
    
    setActiveForm(null);
    refreshData();
  };

  const handleAddNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addNotice({
      title: formData.get('title') as string,
      message: formData.get('message') as string,
      type: formData.get('type') as 'general' | 'urgent' | 'payment',
      expiresAt: formData.get('expiresAt') as string
    });
    setActiveForm(null);
    refreshData();
  };

  const handleAddLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const lessonData: any = {
      classId: formData.get('classId') as string,
      title: formData.get('title') as string,
      titleSinhala: formData.get('titleSinhala') as string,
      description: formData.get('description') as string,
      youtubeUrl: formData.get('youtubeUrl') as string,
      duration: formData.get('duration') as string,
      order: Number(formData.get('order')),
      isActive: true
    };

    const month = formData.get('month') as string;
    if (month) lessonData.month = month;
    
    addLesson(lessonData);
    setActiveForm(null);
    refreshData();
  };

  const handleAddLiveClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const liveClassData: any = {
      classId: formData.get('classId') as string,
      title: formData.get('title') as string,
      scheduledAt: formData.get('scheduledAt') as string,
      duration: formData.get('duration') as string,
      isActive: true
    };

    const zoomLink = formData.get('zoomLink') as string;
    const grade = formData.get('grade') as string;
    const enrolledOnly = formData.get('enrolledOnly') === 'on';
    
    if (zoomLink) liveClassData.zoomLink = zoomLink;
    if (grade) liveClassData.grade = Number(grade);
    if (enrolledOnly) liveClassData.enrolledOnly = enrolledOnly;
    
    addLiveClass(liveClassData);
    setActiveForm(null);
    refreshData();
  };

  const handleAddPaper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const studentMark: any = {
      studentId: formData.get('studentId') as string,
      marks: Number(formData.get('marks'))
    };

    const paperUrl = formData.get('paperUrl') as string;
    if (paperUrl) studentMark.paperUrl = paperUrl;
    
    addPaper({
      classId: formData.get('classId') as string,
      name: formData.get('name') as string,
      maxMarks: Number(formData.get('maxMarks')),
      studentMarks: [studentMark]
    });
    setActiveForm(null);
    refreshData();
  };

  const handleSearchStudent = () => {
    const student = getStudentById(searchStudentId);
    if (student) {
      setSelectedStudent(student);
      const stats = {
        totalLogins: 15,
        lastActive: new Date().toLocaleDateString(),
        totalWatchTime: 24,
        papersCount: 5,
        expiredClasses: []
      };
      setStudentStats(stats);
    }
  };

  const QuickAction = ({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`p-4 ${color} rounded-lg hover:opacity-90 transition-all transform hover:scale-105 text-center shadow-sm hover:shadow-md`}
    >
      <Icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </button>
  );

  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h2>
              <p className="text-gray-400">Manage your LMS system</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveForm('activate')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Activate Student
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Classes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeClasses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">Rs. {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Payments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sticky top-0 z-30 bg-gray-50 py-2">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'classes', label: 'Classes', icon: BookOpen },
            { id: 'live-classes', label: 'Live Classes', icon: Video },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'marks', label: 'Marks & Papers', icon: FileText },
            { id: 'notices', label: 'Notices', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setActiveForm(null); }}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Container */}
        <div ref={tabContentRef} className="bg-white rounded-xl shadow-md p-6">
          {/* Overview */}
          {activeTab === 'overview' && !activeForm && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <QuickAction 
                  icon={Plus} 
                  label="Add Class" 
                  color="bg-blue-50 hover:bg-blue-100 text-blue-600"
                  onClick={() => setActiveForm('class')}
                />
                <QuickAction 
                  icon={BookOpen} 
                  label="Add Lesson" 
                  color="bg-green-50 hover:bg-green-100 text-green-600"
                  onClick={() => setActiveForm('lesson')}
                />
                <QuickAction 
                  icon={Video} 
                  label="Live Class" 
                  color="bg-purple-50 hover:bg-purple-100 text-purple-600"
                  onClick={() => setActiveForm('live')}
                />
                <QuickAction 
                  icon={FileText} 
                  label="Add Marks" 
                  color="bg-orange-50 hover:bg-orange-100 text-orange-600"
                  onClick={() => setActiveForm('marks')}
                />
                <QuickAction 
                  icon={Bell} 
                  label="Post Notice" 
                  color="bg-amber-50 hover:bg-amber-100 text-amber-600"
                  onClick={() => setActiveForm('notice')}
                />
                <QuickAction 
                  icon={Download} 
                  label="Add PDF/Zoom" 
                  color="bg-pink-50 hover:bg-pink-100 text-pink-600"
                  onClick={() => { setContentType('pdf'); setActiveForm('content'); }}
                />
                <QuickAction 
                  icon={Unlock} 
                  label="Activate Student" 
                  color="bg-teal-50 hover:bg-teal-100 text-teal-600"
                  onClick={() => setActiveForm('activate')}
                />
              </div>

              {/* Recent Activity Summary */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Recent Payments</h4>
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                        <span>{payment.studentId}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Rs. {payment.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Upcoming Live Classes</h4>
                  <div className="space-y-3">
                    {liveClasses
                      .filter(l => l.scheduledAt && new Date(l.scheduledAt) > new Date())
                      .slice(0, 5)
                      .map((live) => (
                      <div key={live.id} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                        <span>{live.title}</span>
                        <span className="text-blue-600 text-xs">
                          {live.scheduledAt ? new Date(live.scheduledAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students */}
          {activeTab === 'students' && !activeForm && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">All Students ({students.length})</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Search Student ID..." 
                    className="form-input text-sm"
                    value={searchStudentId}
                    onChange={(e) => setSearchStudentId(e.target.value)}
                  />
                  <button 
                    onClick={handleSearchStudent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mobile</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{student.fullName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{student.grade}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{student.mobileNumber}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            student.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleViewStudent(student.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Classes */}
          {activeTab === 'classes' && !activeForm && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">All Classes ({classes.length})</h3>
                <button 
                  onClick={() => setActiveForm('class')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Class
                </button>
              </div>
              
              <div className="space-y-4">
                {classes.map((classData) => {
                  const extClass = classData as ExtendedClass;
                  return (
                  <div key={classData.id} className="border rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => setExpandedClass(expandedClass === classData.id ? null : classData.id)}
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{classData.name} (Grade {classData.grade})</h4>
                        <p className="text-sm text-gray-600">Month: {extClass.month || 'Not specified'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          classData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {classData.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {expandedClass === classData.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                    
                    {expandedClass === classData.id && (
                      <div className="p-4 bg-white space-y-4">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <h5 className="font-medium text-blue-900 mb-2">Lessons</h5>
                            <p className="text-2xl font-bold text-blue-600">{extClass.lessons?.length || 0}</p>
                            <button 
                              onClick={() => { setSelectedClass(classData); setActiveForm('lesson'); }}
                              className="text-sm text-blue-600 mt-2 hover:underline"
                            >
                              + Add Lesson
                            </button>
                          </div>
                          
                          <div className="bg-purple-50 p-3 rounded-lg text-center">
                            <h5 className="font-medium text-purple-900 mb-2">PDFs</h5>
                            <p className="text-2xl font-bold text-purple-600">{extClass.pdfs?.length || 0}</p>
                            <button 
                              onClick={() => { setSelectedClass(classData); setContentType('pdf'); setActiveForm('content'); }}
                              className="text-sm text-purple-600 mt-2 hover:underline"
                            >
                              + Add PDF
                            </button>
                          </div>
                          
                          <div className="bg-green-50 p-3 rounded-lg text-center">
                            <h5 className="font-medium text-green-900 mb-2">Recordings</h5>
                            <p className="text-2xl font-bold text-green-600">{extClass.recordings?.length || 0}</p>
                            <button 
                              onClick={() => { setSelectedClass(classData); setContentType('recording'); setActiveForm('content'); }}
                              className="text-sm text-green-600 mt-2 hover:underline"
                            >
                              + Add Recording
                            </button>
                          </div>
                          
                          <div className="bg-orange-50 p-3 rounded-lg text-center">
                            <h5 className="font-medium text-orange-900 mb-2">Zoom Links</h5>
                            <p className="text-2xl font-bold text-orange-600">{extClass.zoomLinks?.length || 0}</p>
                            <button 
                              onClick={() => { setSelectedClass(classData); setContentType('zoom'); setActiveForm('content'); }}
                              className="text-sm text-orange-600 mt-2 hover:underline"
                            >
                              + Add Zoom
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Enrolled Students: {classData.enrolledStudents?.length || 0}</h5>
                          <div className="flex gap-2 flex-wrap">
                            {classData.enrolledStudents?.map((id) => (
                              <span key={id} className="px-2 py-1 bg-gray-100 rounded text-sm">{id}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Live Classes */}
          {activeTab === 'live-classes' && !activeForm && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Live Classes</h3>
                <button 
                  onClick={() => setActiveForm('live')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Live Class
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {liveClasses.map((live) => (
                  <div key={live.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{live.title}</h4>
                        <p className="text-sm text-gray-600">Grade {live.grade || 'All'}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        live.scheduledAt && new Date(live.scheduledAt) > new Date() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {live.scheduledAt && new Date(live.scheduledAt) > new Date() ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {live.scheduledAt ? new Date(live.scheduledAt).toLocaleString() : 'Not scheduled'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {live.duration || 'N/A'}
                      </div>
                      {live.zoomLink && (
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          <a href={live.zoomLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                            Zoom Link
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-xs text-gray-500">
                        {live.enrolledOnly ? 'Enrolled students only' : 'Free for all'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments */}
          {activeTab === 'payments' && !activeForm && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Payments</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Payment ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Method</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.filter(p => p.status === 'pending').map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{payment.studentId}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Rs. {payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{payment.method}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprovePayment(payment.id)}
                              className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment.id)}
                              className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Marks & Papers */}
          {activeTab === 'marks' && !activeForm && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Marks Management</h3>
                <button 
                  onClick={() => setActiveForm('marks')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Marks
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Search Student</h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Student ID" 
                    className="form-input flex-1"
                    value={searchStudentId}
                    onChange={(e) => setSearchStudentId(e.target.value)}
                  />
                  <button 
                    onClick={handleSearchStudent}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                </div>
              </div>

              {selectedStudent && studentStats && (
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedStudent.fullName}</h4>
                      <p className="text-gray-600">ID: {selectedStudent.id} | Grade: {selectedStudent.grade}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      selectedStudent.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedStudent.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Total Logins</p>
                      <p className="text-2xl font-bold text-blue-600">{studentStats.totalLogins}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Last Active</p>
                      <p className="text-lg font-bold text-green-600">{studentStats.lastActive}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Watch Time</p>
                      <p className="text-2xl font-bold text-purple-600">{studentStats.totalWatchTime}h</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Papers</p>
                      <p className="text-2xl font-bold text-orange-600">{studentStats.papersCount}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notices */}
          {activeTab === 'notices' && !activeForm && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notices ({notices.length})</h3>
                <button 
                  onClick={() => setActiveForm('notice')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Notice
                </button>
              </div>
              <div className="space-y-3">
                {notices.map((notice) => (
                  <div 
                    key={notice.id} 
                    className={`p-4 rounded-lg ${
                      notice.type === 'urgent' ? 'bg-red-50 border border-red-200' :
                      notice.type === 'payment' ? 'bg-amber-50 border border-amber-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{notice.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notice.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => { deleteNotice(notice.id); refreshData(); }}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* INLINE FORMS - Appear below the main container with scroll */}
        
        {/* Add Class Form */}
        {activeForm === 'class' && (
          <div ref={formRef} className="mt-6 bg-white rounded-xl shadow-lg border-t-4 border-blue-500 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Class</h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Class Name (English)</label>
                  <input name="name" className="form-input w-full" required />
                </div>
                <div>
                  <label className="form-label">Class Name (Sinhala)</label>
                  <input name="nameSinhala" className="form-input sinhala-text w-full" required />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Grade</label>
                  <select name="grade" className="form-input w-full" required>
                    {[6, 7, 8, 9, 10, 11].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Month</label>
                  <select name="month" className="form-input w-full" required>
                    <option value="">Select Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <select name="type" className="form-input w-full">
                    <option value="monthly">Monthly</option>
                    <option value="special">Special</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="form-label">Price (Rs.)</label>
                <input name="price" type="number" className="form-input w-full" required />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Description (English)</label>
                  <textarea name="description" className="form-input w-full" rows={2} />
                </div>
                <div>
                  <label className="form-label">Description (Sinhala)</label>
                  <textarea name="descriptionSinhala" className="form-input sinhala-text w-full" rows={2} />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveForm(null)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Class
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Lesson Form */}
        {activeForm === 'lesson' && (
          <div ref={formRef} className="mt-6 bg-white rounded-xl shadow-lg border-t-4 border-green-500 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Lesson</h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
                <input type="checkbox" id="isFree" name="isFree" className="w-4 h-4" />
                <label htmlFor="isFree" className="text-sm font-medium text-green-900">Free Lesson (No payment required)</label>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Select Class</label>
                  <select name="classId" className="form-input w-full" defaultValue={selectedClass?.id || ''}>
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Month</label>
                  <select name="month" className="form-input w-full">
                    <option value="">Select Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Lesson Title (English)</label>
                  <input name="title" className="form-input w-full" required />
                </div>
                <div>
                  <label className="form-label">Lesson Title (Sinhala)</label>
                  <input name="titleSinhala" className="form-input sinhala-text w-full" />
                </div>
              </div>
              
              <div>
                <label className="form-label">YouTube URL</label>
                <input name="youtubeUrl" className="form-input w-full" placeholder="https://youtube.com/embed/..." required />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Duration</label>
                  <input name="duration" className="form-input w-full" placeholder="45 min" />
                </div>
                <div>
                  <label className="form-label">Order</label>
                  <input name="order" type="number" className="form-input w-full" defaultValue={1} />
                </div>
              </div>
              
              <div>
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input w-full" rows={2} />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveForm(null)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Add Lesson
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Live Class Form */}
        {activeForm === 'live' && (
          <div ref={formRef} className="mt-6 bg-white rounded-xl shadow-lg border-t-4 border-purple-500 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Schedule Live Class</h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            <form onSubmit={handleAddLiveClass} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Select Class</label>
                  <select name="classId" className="form-input w-full" required>
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Grade</label>
                  <select name="grade" className="form-input w-full" required>
                    {[6, 7, 8, 9, 10, 11].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="form-label">Title</label>
                <input name="title" className="form-input w-full" placeholder="Live Revision Session" required />
              </div>
              
              <div>
                <label className="form-label">Zoom Link</label>
                <input name="zoomLink" className="form-input w-full" placeholder="https://zoom.us/..." required />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Scheduled Date & Time</label>
                  <input name="scheduledAt" type="datetime-local" className="form-input w-full" required />
                </div>
                <div>
                  <label className="form-label">Duration</label>
                  <input name="duration" className="form-input w-full" placeholder="1 hour" required />
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <input type="checkbox" id="enrolledOnly" name="enrolledOnly" defaultChecked className="w-4 h-4" />
                <label htmlFor="enrolledOnly" className="text-sm text-purple-900 font-medium">Enrolled students only</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveForm(null)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Marks Form */}
        {activeForm === 'marks' && (
          <div ref={formRef} className="mt-6 bg-white rounded-xl shadow-lg border-t-4 border-orange-500 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Paper & Marks</h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            
            <div className="mb-4 flex gap-2 p-3 bg-orange-50 rounded-lg">
              <input 
                type="text" 
                placeholder="Enter Student ID first..." 
                className="form-input flex-1"
                value={searchStudentId}
                onChange={(e) => setSearchStudentId(e.target.value)}
              />
              <button 
                type="button"
                onClick={handleSearchStudent}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg"
              >
                Find Student
              </button>
            </div>

            {selectedStudent && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-900">{selectedStudent.fullName}</p>
                <p className="text-sm text-green-700">ID: {selectedStudent.id} | Grade: {selectedStudent.grade}</p>
              </div>
            )}
            
            <form onSubmit={handleAddPaper} className="space-y-4">
              <input type="hidden" name="studentId" value={selectedStudent?.id || ''} />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Select Class</label>
                  <select name="classId" className="form-input w-full" required>
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Paper Name</label>
                  <input name="name" className="form-input w-full" placeholder="Term Test 1" required />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Maximum Marks</label>
                  <input name="maxMarks" type="number" className="form-input w-full" defaultValue={100} required />
                </div>
                <div>
                  <label className="form-label">Student Marks</label>
                  <input name="marks" type="number" className="form-input w-full" required />
                </div>
              </div>
              
              <div>
                <label className="form-label">Paper PDF URL (Optional)</label>
                <input name="paperUrl" className="form-input w-full" placeholder="Link to scanned paper" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveForm(null)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Add Marks
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Notice Form */}
        {activeForm === 'notice' && (
          <div ref={formRef} className="mt-6 bg-white rounded-xl shadow-lg border-t-4 border-amber-500 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Post New Notice</h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label className="form-label">Title</label>
                <input name="title" className="form-input w-full" required />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea name="message" className="form-input w-full" rows={3} required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Type</label>
                  <select name="type" className="form-input w-full">
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="payment">Payment</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Expires At</label>
                  <input name="expiresAt" type="date" className="form-input w-full" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveForm(null)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Content Form (PDF/Zoom/Recording) */}
        {activeForm === 'content' && (
          <div ref={formRef} className="mt-6 bg-white rounded-xl shadow-lg border-t-4 border-pink-500 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add {contentType === 'pdf' ? 'PDF' : contentType === 'recording' ? 'Recording' : contentType === 'zoom' ? 'Zoom Link' : 'Tutorial'}</h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            
            <div className="mb-4 flex gap-2">
              <button 
                type="button"
                onClick={() => setContentType('pdf')}
                className={`px-4 py-2 rounded-lg ${contentType === 'pdf' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                PDF
              </button>
              <button 
                type="button"
                onClick={() => setContentType('recording')}
                className={`px-4 py-2 rounded-lg ${contentType === 'recording' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >
                Recording
              </button>
              <button 
                type="button"
                onClick={() => setContentType('zoom')}
                className={`px-4 py-2 rounded-lg ${contentType === 'zoom' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
              >
                Zoom
              </button>
              <button 
                type="button"
                onClick={() => setContentType('tutorial')}
                className={`px-4 py-2 rounded-lg ${contentType === 'tutorial' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}
              >
                Tutorial
              </button>
            </div>
            
            <form onSubmit={handleAddContent} className="space-y-4">
              <input type="hidden" name="contentType" value={contentType} />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Select Class</label>
                  <select name="classId" className="form-input w-full" required defaultValue={selectedClass?.id || ''}>
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} (Grade {c.grade})</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Month</label>
                  <select name="contentMonth" className="form-input w-full" required>
                    <option value="">Select Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="form-label">Unit/Headline</label>
                <input name="unit" className="form-input w-full" placeholder="e.g., Unit 1 - Algebra" required />
              </div>
              
              <div>
                <label className="form-label">Title</label>
                <input name="title" className="form-input w-full" required />
              </div>
              
              <div>
                <label className="form-label">
                  {contentType === 'pdf' ? 'PDF URL' : contentType === 'recording' ? 'Video URL' : contentType === 'zoom' ? 'Zoom Link' : 'Tutorial Link'}
                </label>
                <input name="url" className="form-input w-full" required />
              </div>
              
              <div>
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input w-full" rows={2} />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveForm(null)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                  Add Content
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activate Student Form */}
        {activeForm === 'activate' && (
          <div ref={formRef} className="mt-6 bg-white rounded-xl shadow-lg border-t-4 border-teal-500 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Activate Student Manually</h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Enter the Student ID to manually activate their account. This is useful for expired classes or special cases.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Student ID</label>
                  <input 
                    type="text" 
                    className="form-input w-full" 
                    placeholder="Enter Student ID"
                    value={searchStudentId}
                    onChange={(e) => setSearchStudentId(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveForm(null)}
                    className="flex-1 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      handleActivateStudent(searchStudentId);
                      setActiveForm(null);
                      setSearchStudentId('');
                    }}
                    className="flex-1 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Activate Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Profile View */}
        {activeForm === 'profile' && selectedStudent && (
          <div ref={formRef} className="mt-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Student Profile</h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedStudent.fullName}</p>
                    <p><span className="text-gray-600">Student ID:</span> {selectedStudent.id}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedStudent.email}</p>
                    <p><span className="text-gray-600">Mobile:</span> {selectedStudent.mobileNumber}</p>
                    <p><span className="text-gray-600">Grade:</span> {selectedStudent.grade}</p>
                    <p>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedStudent.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedStudent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
                
                {!selectedStudent.isActive && (
                  <button 
                    onClick={() => handleActivateStudent(selectedStudent.id)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Activate Account
                  </button>
                )}
              </div>
              
              {studentStats && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">Activity Statistics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded text-center">
                        <p className="text-2xl font-bold text-blue-600">{studentStats.totalLogins}</p>
                        <p className="text-xs text-gray-600">Total Logins</p>
                      </div>
                      <div className="bg-white p-3 rounded text-center">
                        <p className="text-2xl font-bold text-green-600">{studentStats.totalWatchTime}h</p>
                        <p className="text-xs text-gray-600">Watch Time</p>
                      </div>
                      <div className="bg-white p-3 rounded text-center">
                        <p className="text-2xl font-bold text-purple-600">{studentStats.papersCount}</p>
                        <p className="text-xs text-gray-600">Papers</p>
                      </div>
                      <div className="bg-white p-3 rounded text-center">
                        <p className="text-lg font-bold text-orange-600">{studentStats.lastActive}</p>
                        <p className="text-xs text-gray-600">Last Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;
