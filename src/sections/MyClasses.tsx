// ============================================
// MY CLASSES PAGE
// Shows active classes with marks charts
// ============================================

import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Play, FileText, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClasses, getPapersByClass, getPaymentsByStudent } from '@/data/store'; // getPaymentsByStudent එක් කළා
import type { Class, Paper } from '@/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

interface MyClassesProps {
  onNavigate: (page: string, classId?: string) => void;
}

const MyClasses: React.FC<MyClassesProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState<(Class & { expiryDate?: string })[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    if (currentUser) {
      const allClasses = getClasses();
      const allPayments = getPaymentsByStudent(currentUser.id);

      // 1. සාර්ථක ගෙවීම් කර ඇති පන්ති පමණක් ලබා ගැනීම
      // 2. දින 30 ක කාල සීමාව පරීක්ෂා කිරීම
      const activeEnrolled = allClasses.filter(classItem => {
        const payment = allPayments.find(p => p.classId === classItem.id && p.status === 'completed');
        
        if (payment) {
          const paymentDate = new Date(payment.date);
          const expiryDate = new Date(paymentDate);
          expiryDate.setDate(paymentDate.getDate() + 40); // දින 40 ක් එකතු කිරීම
          
          const today = new Date();
          return expiryDate > today; // දින 40 ඉකුත් වී නැතිනම් පමණක් පෙන්වන්න
        }
        return false;
      }).map(classItem => {
        const payment = allPayments.find(p => p.classId === classItem.id);
        const expiryDate = new Date(new Date(payment!.date).setDate(new Date(payment!.date).getDate() + 40));
        return { 
          ...classItem, 
          expiryDate: expiryDate.toLocaleDateString() 
        };
      });

      setEnrolledClasses(activeEnrolled);
      
      if (activeEnrolled.length > 0 && !selectedClass) {
        setSelectedClass(activeEnrolled[0]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedClass) {
      setPapers(getPapersByClass(selectedClass.id));
    }
  }, [selectedClass]);

  if (!currentUser) {
    return (
      <section className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Please Login</h3>
          <button onClick={() => onNavigate('login')} className="btn-primary px-6 py-2 bg-blue-600 text-white rounded-lg">
            Login Now
          </button>
        </div>
      </section>
    );
  }

  if (enrolledClasses.length === 0) {
    return (
      <section className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Classes</h3>
          <p className="text-gray-500 mb-4 sinhala-text">ඔබට දැනට සක්‍රීය පන්ති නොමැත (හෝ කාලය ඉකුත් වී ඇත)</p>
          <button onClick={() => onNavigate('store')} className="btn-primary px-6 py-2 bg-blue-600 text-white rounded-lg">
            Browse Classes
          </button>
        </div>
      </section>
    );
  }

  const getStudentMarks = (paper: Paper) => {
    const mark = paper.studentMarks.find(m => m.studentId === currentUser.id);
    return mark ? mark.marks : 0;
  };

  // --- Charts Logic (මෙහි වෙනසක් කර නැත) ---
  const marksChartData = {
    labels: papers.map(p => p.name),
    datasets: [
      { label: 'Your Marks', data: papers.map(p => getStudentMarks(p)), backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 4 },
      { label: 'Maximum Marks', data: papers.map(p => p.maxMarks), backgroundColor: 'rgba(209, 213, 219, 0.5)', borderRadius: 4 }
    ],
  };

  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h2>
          <p className="text-gray-600 sinhala-text">ඔබගේ සක්‍රීය පන්ති සහ අධ්‍යන ප්‍රගතිය</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Active Subscriptions</h3>
              <div className="space-y-3">
                {enrolledClasses.map((classData) => (
                  <button
                    key={classData.id}
                    onClick={() => setSelectedClass(classData)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedClass?.id === classData.id 
                        ? 'bg-blue-50 border-blue-500 shadow-sm' 
                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-bold text-sm text-gray-900">{classData.name}</p>
                    <p className="text-xs text-gray-500">Grade {classData.grade}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-orange-600">
                      <Clock className="w-3 h-3" />
                      Expires: {classData.expiryDate}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedClass && (
              <>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedClass.name}</h3>
                      <p className="text-gray-500 sinhala-text">{selectedClass.nameSinhala}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onNavigate('videos', selectedClass.id)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium"
                      >
                        <Play className="w-4 h-4 fill-current" /> Lessons
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-md p-4 text-center border-b-4 border-blue-500">
                    <p className="text-2xl font-bold text-gray-900">{selectedClass.lessons.length}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Lessons Available</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 text-center border-b-4 border-green-500">
                    <p className="text-2xl font-bold text-gray-900">Active</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 text-center border-b-4 border-amber-500">
                    <p className="text-2xl font-bold text-gray-900">{papers.length}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Papers</p>
                  </div>
                </div>

                {/* Charts & Tables remain same... */}
                {papers.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" /> Performance Analysis
                    </h4>
                    <div className="h-64">
                      <Bar data={marksChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyClasses;
