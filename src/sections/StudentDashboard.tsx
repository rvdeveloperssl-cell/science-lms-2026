// ============================================
// STUDENT DASHBOARD
// Personal dashboard for students
// ============================================

import React, { useState, useEffect } from 'react';
import { User, BookOpen, CreditCard, Bell, LogOut, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClasses, getPaymentsByStudent, getNotices } from '@/data/store';
import type { Class, Notice, Payment } from '@/types';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState<Class[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (currentUser) {
      // Get enrolled classes
      const allClasses = getClasses();
      const enrolled = allClasses.filter(c => 
        c.enrolledStudents.includes(currentUser.id)
      );
      setEnrolledClasses(enrolled);

      // Get pending payments
      const payments = getPaymentsByStudent(currentUser.id);
      const pending = payments.filter(p => p.status === 'pending');
      setPendingPayments(pending);

      // Get notices
      setNotices(getNotices());
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <section className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Please Login</h3>
          <p className="text-gray-500 mb-4">You need to login to view your dashboard</p>
          <button onClick={() => onNavigate('login')} className="btn-primary">
            Login Now
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 mb-1">Welcome back,</p>
              <h2 className="text-2xl md:text-3xl font-bold">{currentUser.fullName}</h2>
              <p className="text-blue-200 text-sm mt-1">{currentUser.id} | Grade {currentUser.grade}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Classes */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  My Active Classes
                </h3>
                <button 
                  onClick={() => onNavigate('my-classes')}
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {enrolledClasses.length > 0 ? (
                <div className="space-y-3">
                  {enrolledClasses.slice(0, 3).map((classData) => (
                    <div 
                      key={classData.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('my-classes')}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{classData.name}</p>
                        <p className="text-sm text-gray-500">{classData.lessons.length} lessons</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-3">You haven&apos;t enrolled in any classes yet</p>
                  <button 
                    onClick={() => onNavigate('store')}
                    className="btn-primary text-sm"
                  >
                    Browse Classes
                  </button>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'My Classes', icon: BookOpen, page: 'my-classes' },
                  { label: 'Videos', icon: BookOpen, page: 'videos' },
                  { label: 'Schedule', icon: BookOpen, page: 'schedule' },
                  { label: 'Notes', icon: BookOpen, page: 'notes' },
                ].map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onNavigate(link.page)}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors text-center"
                    >
                      <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <span className="text-sm text-gray-700">{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending Payments */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Pending Payments
              </h3>
              
              {pendingPayments.length > 0 ? (
                <div className="space-y-3">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Payment Pending</span>
                      </div>
                      <p className="text-sm text-gray-600">Rs. {payment.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No pending payments</p>
              )}
            </div>

            {/* Notices */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-red-600" />
                Notices
              </h3>
              
              {notices.length > 0 ? (
                <div className="space-y-3">
                  {notices.slice(0, 3).map((notice) => (
                    <div 
                      key={notice.id} 
                      className={`p-3 rounded-lg ${
                        notice.type === 'urgent' ? 'bg-red-50 border border-red-200' :
                        notice.type === 'payment' ? 'bg-amber-50 border border-amber-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <p className="font-medium text-sm text-gray-900">{notice.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notice.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No new notices</p>
              )}
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Student ID</span>
                  <span className="font-medium">{currentUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Grade</span>
                  <span className="font-medium">{currentUser.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobile</span>
                  <span className="font-medium">{currentUser.mobileNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{currentUser.email || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;
