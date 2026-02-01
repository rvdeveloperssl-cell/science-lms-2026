// ============================================
// MY CLASSES PAGE
// Shows active classes with marks charts
// ============================================

import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Play, FileText, Video, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClasses, getPapersByClass } from '@/data/store';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface MyClassesProps {
  onNavigate: (page: string, classId?: string) => void;
}

const MyClasses: React.FC<MyClassesProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    if (currentUser && currentUser.payments) {
      const allClasses = getClasses();
      const now = new Date();
      const EXPIRY_DAYS = 40; // දවස් 40 කින් expire වන ලෙස සැකසීම

      // Payment එකක් කරලා තියෙන සහ expire නොවූ පන්ති පමණක් පෙරා ගැනීම
      const paidClasses = allClasses.filter(c => {
        const payment = currentUser.payments?.find(p => p.classId === c.id && p.status === 'completed');
        
        if (!payment) return false;

        // පේමන්ට් එක කළ දින සිට ගතවූ කාලය බැලීම
        const paymentDate = new Date(payment.date);
        const diffTime = Math.abs(now.getTime() - paymentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays <= EXPIRY_DAYS;
      });

      setEnrolledClasses(paidClasses);
      
      if (paidClasses.length > 0 && !selectedClass) {
        setSelectedClass(paidClasses[0]);
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
          <button onClick={() => onNavigate('login')} className="btn-primary">Login Now</button>
        </div>
      </section>
    );
  }

  if (enrolledClasses.length === 0) {
    return (
      <section className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Classes</h3>
          <p className="text-gray-500 mb-6 sinhala-text leading-relaxed">
            ඔබට දැනට සක්‍රීය පන්ති නොමැත. පන්තියක් සක්‍රීය වීමට නම් ගෙවීම් සිදුකර තිබිය යුතු අතර, ගෙවීම් කර දින 40ක් ඉක්මවා ඇත්නම් එය ස්වයංක්‍රීයව අක්‍රීය වේ.
          </p>
          <button onClick={() => onNavigate('store')} className="btn-primary w-full">Browse Classes</button>
        </div>
      </section>
    );
  }

  const getStudentMarks = (paper: Paper) => {
    const mark = paper.studentMarks.find(m => m.studentId === currentUser.id);
    return mark ? mark.marks : 0;
  };

  // Chart data setup... (keeping your existing chart logic)
  const marksChartData = {
    labels: papers.map(p => p.name),
    datasets: [
      {
        label: 'Your Marks',
        data: papers.map(p => getStudentMarks(p)),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ],
  };

  const averageMarks = papers.length > 0 
    ? papers.reduce((sum, p) => sum + getStudentMarks(p), 0) / papers.length 
    : 0;

  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Learning Dashboard</h2>
          <p className="text-gray-600 sinhala-text">ඔබේ ක්‍රියාකාරී පන්ති සහ අධ්‍යයන ප්‍රගතිය</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Class Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Active Classes</h3>
              <div className="space-y-2">
                {enrolledClasses.map((classData) => (
                  <button
                    key={classData.id}
                    onClick={() => setSelectedClass(classData)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedClass?.id === classData.id 
                        ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <p className="font-bold text-sm">{classData.name}</p>
                    <p className={`text-xs ${selectedClass?.id === classData.id ? 'text-blue-100' : 'text-gray-500'}`}>Grade {classData.grade}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedClass && (
              <>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedClass.name}</h3>
                      <p className="text-blue-600 font-medium sinhala-text">{selectedClass.nameSinhala}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Zoom Link Section */}
                      <a 
                        href="#" // මෙතනට Admin දෙන Zoom link එක එන විදියට හදන්න
                        target="_blank"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm"
                      >
                        <Video className="w-4 h-4" />
                        Join Zoom Live
                      </a>
                      <button 
                        onClick={() => onNavigate('videos')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Play className="w-4 h-4" />
                        Lessons
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats & Charts remain similar to your original code */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Total Lessons</p>
                    <p className="text-2xl font-black text-gray-900">{selectedClass.lessons.length}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Average Marks</p>
                    <p className="text-2xl font-black text-blue-600">{averageMarks.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                    <p className="text-2xl font-black text-green-500">Active</p>
                  </div>
                </div>

                {/* Mark Charts and Paper results table... */}
                {papers.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="text-blue-600 w-5 h-5" /> Progress Tracking
                    </h4>
                    <div className="h-64">
                      <Bar data={marksChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 sinhala-text">මෙම පන්තියට අදාළ ප්‍රශ්න පත්‍ර තවමත් ඇතුළත් කර නොමැත.</p>
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
