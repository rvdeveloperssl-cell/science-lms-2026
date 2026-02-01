// ============================================
// MY CLASSES PAGE
// Shows active classes with marks charts
// ============================================

import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Video, AlertCircle } from 'lucide-react';
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
  PointElement,
  LineElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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
    // Casting to any to safely access payments property
    const user = currentUser as any;
    
    if (user && user.payments) {
      const allClasses = getClasses();
      const now = new Date();
      const EXPIRY_DAYS = 40; 

      const paidClasses = allClasses.filter(c => {
        const payment = user.payments?.find((p: any) => p.classId === c.id && p.status === 'completed');
        
        if (!payment) return false;

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
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Classes</h3>
          <p className="text-gray-500 mb-6 sinhala-text">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h2>
          <p className="text-gray-600 sinhala-text">ඔබගේ සක්‍රීය පන්ති සහ ප්‍රගතිය</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Class Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Your Classes</h3>
              <div className="space-y-2">
                {enrolledClasses.map((classData) => (
                  <button
                    key={classData.id}
                    onClick={() => setSelectedClass(classData)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedClass?.id === classData.id 
                        ? 'bg-blue-50 border-2 border-blue-500' 
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-900">{classData.name}</p>
                    <p className="text-xs text-gray-500">Grade {classData.grade}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {selectedClass && (
              <>
                {/* Class Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedClass.name}</h3>
                      <p className="text-gray-500 sinhala-text">{selectedClass.nameSinhala}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                        <Video className="w-4 h-4" />
                        Zoom Live
                      </button>
                      <button 
                        onClick={() => onNavigate('videos')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Lessons
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Dashboard */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <p className="text-sm text-gray-500">Lessons</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedClass.lessons.length}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <p className="text-sm text-gray-500">Average</p>
                    <p className="text-2xl font-bold text-blue-600">{averageMarks.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <p className="text-sm text-gray-500">Papers</p>
                    <p className="text-2xl font-bold text-gray-900">{papers.length}</p>
                  </div>
                </div>

                {/* Performance Chart */}
                {papers.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Marks Overview</h4>
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
