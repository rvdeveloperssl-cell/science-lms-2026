// ============================================
// MY CLASSES PAGE
// Shows active classes with marks charts
// ============================================

import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Play, FileText } from 'lucide-react';
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

// Register Chart.js components
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
    if (currentUser) {
      const allClasses = getClasses();
      const enrolled = allClasses.filter(c => 
        c.enrolledStudents.includes(currentUser.id)
      );
      setEnrolledClasses(enrolled);
      
      if (enrolled.length > 0 && !selectedClass) {
        setSelectedClass(enrolled[0]);
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
          <button onClick={() => onNavigate('login')} className="btn-primary">
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
          <p className="text-gray-500 mb-4 sinhala-text">ඔබට සක්‍රීය පන්ති නොමැත</p>
          <button onClick={() => onNavigate('store')} className="btn-primary">
            Browse Classes
          </button>
        </div>
      </section>
    );
  }

  // Get marks for current student
  const getStudentMarks = (paper: Paper) => {
    const mark = paper.studentMarks.find(m => m.studentId === currentUser.id);
    return mark ? mark.marks : 0;
  };

  // Chart data for marks
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
      },
      {
        label: 'Maximum Marks',
        data: papers.map(p => p.maxMarks),
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
        borderColor: 'rgba(209, 213, 219, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ],
  };

  const marksChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Performance',
      },
    },
  };

  // Calculate average
  const averageMarks = papers.length > 0 
    ? papers.reduce((sum, p) => sum + getStudentMarks(p), 0) / papers.length 
    : 0;

  // Performance distribution
  const performanceData = {
    labels: ['Excellent (80-100)', 'Good (60-79)', 'Average (40-59)', 'Below Average (0-39)'],
    datasets: [
      {
        data: [
          papers.filter(p => getStudentMarks(p) >= 80).length,
          papers.filter(p => getStudentMarks(p) >= 60 && getStudentMarks(p) < 80).length,
          papers.filter(p => getStudentMarks(p) >= 40 && getStudentMarks(p) < 60).length,
          papers.filter(p => getStudentMarks(p) < 40).length,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h2>
          <p className="text-gray-600 sinhala-text">ඔබගේ සක්‍රීය පන්ති සහ ප්‍රගතිය</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Class Selector Sidebar */}
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

          {/* Main Content */}
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
                      <button 
                        onClick={() => onNavigate('videos')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Watch Videos
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedClass.lessons.length}</p>
                    <p className="text-sm text-gray-500">Lessons</p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{averageMarks.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">Average</p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{papers.length}</p>
                    <p className="text-sm text-gray-500">Papers</p>
                  </div>
                </div>

                {/* Charts */}
                {papers.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Marks Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Marks Overview</h4>
                      <div className="h-64">
                        <Bar data={marksChartData} options={marksChartOptions} />
                      </div>
                    </div>

                    {/* Performance Distribution */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Performance Distribution</h4>
                      <div className="h-64 flex items-center justify-center">
                        <Doughnut 
                          data={performanceData} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                              },
                            },
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Paper Results Table */}
                {papers.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-900">Paper Results</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Paper Name</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Your Marks</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Max Marks</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Percentage</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {papers.map((paper) => {
                            const marks = getStudentMarks(paper);
                            const percentage = (marks / paper.maxMarks) * 100;
                            const grade = percentage >= 75 ? 'A' : percentage >= 65 ? 'B' : percentage >= 55 ? 'C' : percentage >= 40 ? 'S' : 'F';
                            
                            return (
                              <tr key={paper.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{paper.name}</td>
                                <td className="px-4 py-3 text-sm text-center font-medium">{marks}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-500">{paper.maxMarks}</td>
                                <td className="px-4 py-3 text-sm text-center">{percentage.toFixed(1)}%</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    grade === 'A' ? 'bg-green-100 text-green-700' :
                                    grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                    grade === 'C' ? 'bg-amber-100 text-amber-700' :
                                    grade === 'S' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {grade}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {papers.length === 0 && (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No papers have been added yet</p>
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
