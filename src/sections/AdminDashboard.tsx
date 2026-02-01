// ============================================
// ADMIN DASHBOARD
// Full admin control panel
// ============================================

import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, CreditCard, Bell, Plus, Trash2, 
  CheckCircle, XCircle, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getAdminStats, getStudents, getClasses, getPayments, 
  getNotices, addNotice, deleteNotice, updatePaymentStatus,
  addClass, addLesson, addPaper
} from '@/data/store';
import type { Student, Class, Payment, Notice } from '@/types';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalStudents: 0, activeClasses: 0, totalRevenue: 0, pendingPayments: 0 });
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  
  // Form states
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showAddPaper, setShowAddPaper] = useState(false);

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
  };

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

  // Approve payment
  const handleApprovePayment = (paymentId: string) => {
    updatePaymentStatus(paymentId, 'completed');
    refreshData();
  };

  // Reject payment
  const handleRejectPayment = (paymentId: string) => {
    updatePaymentStatus(paymentId, 'failed');
    refreshData();
  };

  // Add new class
  const handleAddClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addClass({
      grade: Number(formData.get('grade')),
      name: formData.get('name') as string,
      nameSinhala: formData.get('nameSinhala') as string,
      description: formData.get('description') as string,
      descriptionSinhala: formData.get('descriptionSinhala') as string,
      price: Number(formData.get('price')),
      type: formData.get('type') as 'monthly' | 'special',
      isActive: true,
      lessons: []
    });
    setShowAddClass(false);
    refreshData();
  };

  // Add notice
  const handleAddNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addNotice({
      title: formData.get('title') as string,
      message: formData.get('message') as string,
      type: formData.get('type') as 'general' | 'urgent' | 'payment',
      expiresAt: formData.get('expiresAt') as string
    });
    setShowAddNotice(false);
    refreshData();
  };

  // Add lesson
  const handleAddLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addLesson({
      classId: formData.get('classId') as string,
      title: formData.get('title') as string,
      titleSinhala: formData.get('titleSinhala') as string,
      description: formData.get('description') as string,
      youtubeUrl: formData.get('youtubeUrl') as string,
      duration: formData.get('duration') as string,
      order: Number(formData.get('order')),
      isActive: true
    });
    setShowAddLesson(false);
    refreshData();
  };

  // Add paper
  const handleAddPaper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addPaper({
      classId: formData.get('classId') as string,
      name: formData.get('name') as string,
      maxMarks: Number(formData.get('maxMarks')),
      studentMarks: []
    });
    setShowAddPaper(false);
    refreshData();
  };

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
            <button
              onClick={logout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
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
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'classes', label: 'Classes', icon: BookOpen },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'notices', label: 'Notices', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setShowAddClass(true)}
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  <Plus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Add Class</span>
                </button>
                <button 
                  onClick={() => setShowAddLesson(true)}
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
                >
                  <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Add Lesson</span>
                </button>
                <button 
                  onClick={() => setShowAddNotice(true)}
                  className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-center"
                >
                  <Bell className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Post Notice</span>
                </button>
                <button 
                  onClick={() => setShowAddPaper(true)}
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
                >
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-700">Add Paper</span>
                </button>
              </div>
            </div>
          )}

          {/* Students */}
          {activeTab === 'students' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Students ({students.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Mobile</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Classes */}
          {activeTab === 'classes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">All Classes ({classes.length})</h3>
                <button 
                  onClick={() => setShowAddClass(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Class
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Students</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {classes.map((classData) => (
                      <tr key={classData.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{classData.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{classData.grade}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Rs. {classData.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{classData.enrolledStudents.length}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            classData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {classData.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments */}
          {activeTab === 'payments' && (
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
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment.id)}
                              className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
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

          {/* Notices */}
          {activeTab === 'notices' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notices ({notices.length})</h3>
                <button 
                  onClick={() => setShowAddNotice(true)}
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
      </div>

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Class</h3>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="form-label">Class Name (English)</label>
                <input name="name" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Class Name (Sinhala)</label>
                <input name="nameSinhala" className="form-input sinhala-text" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Grade</label>
                  <select name="grade" className="form-input">
                    {[6, 7, 8, 9, 10, 11].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <select name="type" className="form-input">
                    <option value="monthly">Monthly</option>
                    <option value="special">Special</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Price (Rs.)</label>
                <input name="price" type="number" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Description (English)</label>
                <textarea name="description" className="form-input" rows={2} />
              </div>
              <div>
                <label className="form-label">Description (Sinhala)</label>
                <textarea name="descriptionSinhala" className="form-input sinhala-text" rows={2} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddClass(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Notice Modal */}
      {showAddNotice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Post Notice</h3>
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label className="form-label">Title</label>
                <input name="title" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea name="message" className="form-input" rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Type</label>
                  <select name="type" className="form-input">
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="payment">Payment</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Expires At</label>
                  <input name="expiresAt" type="date" className="form-input" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddNotice(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showAddLesson && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Lesson</h3>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="form-label">Select Class</label>
                <select name="classId" className="form-input" required>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Lesson Title (English)</label>
                <input name="title" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Lesson Title (Sinhala)</label>
                <input name="titleSinhala" className="form-input sinhala-text" />
              </div>
              <div>
                <label className="form-label">YouTube URL</label>
                <input name="youtubeUrl" className="form-input" placeholder="https://youtube.com/embed/..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Duration</label>
                  <input name="duration" className="form-input" placeholder="45 min" />
                </div>
                <div>
                  <label className="form-label">Order</label>
                  <input name="order" type="number" className="form-input" defaultValue={1} />
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input" rows={2} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddLesson(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Add Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Paper Modal */}
      {showAddPaper && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Paper</h3>
            <form onSubmit={handleAddPaper} className="space-y-4">
              <div>
                <label className="form-label">Select Class</label>
                <select name="classId" className="form-input" required>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Paper Name</label>
                <input name="name" className="form-input" placeholder="e.g., Term Test 1" required />
              </div>
              <div>
                <label className="form-label">Maximum Marks</label>
                <input name="maxMarks" type="number" className="form-input" defaultValue={100} required />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddPaper(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Add Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
