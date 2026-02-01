// ============================================
// GRADE-WISE CLASSES SECTION
// Shows classes organized by grade (6-11)
// ============================================

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Lock, Unlock, Users } from 'lucide-react';
import { getClasses } from '@/data/store';
import { useAuth } from '@/context/AuthContext';
import type { Class } from '@/types';

interface GradeClassesProps {
  onNavigate: (page: string, classId?: string) => void;
}

const GradeClasses: React.FC<GradeClassesProps> = ({ onNavigate }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    setClasses(getClasses());
  }, []);

  const grades = [6, 7, 8, 9, 10, 11];

  const getClassesByGrade = (grade: number) => {
    return classes.filter(c => c.grade === grade && c.isActive);
  };

  const isEnrolled = (classId: string) => {
    if (!currentUser) return false;
    const classData = classes.find(c => c.id === classId);
    return classData?.enrolledStudents.includes(currentUser.id) || false;
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            Our Programs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Grade-wise <span className="text-gradient">Classes</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto sinhala-text">
            ඔබගේ ශ්‍රේණියට අදාළ පන්තිය තෝරා ගෙන අධ්‍යාපනය ආරම්භ කරන්න
          </p>
        </div>

        {/* Grade Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedGrade(null)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300
                       ${selectedGrade === null 
                         ? 'bg-blue-700 text-white shadow-lg' 
                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Grades
          </button>
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300
                         ${selectedGrade === grade 
                           ? 'bg-blue-700 text-white shadow-lg' 
                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Grade {grade}
            </button>
          ))}
        </div>

        {/* Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grades
            .filter(grade => selectedGrade === null || selectedGrade === grade)
            .map((grade) => {
              const gradeClasses = getClassesByGrade(grade);
              if (gradeClasses.length === 0) return null;

              return gradeClasses.map((classData) => {
                const enrolled = isEnrolled(classData.id);
                
                return (
                  <div 
                    key={classData.id}
                    className={`group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden
                               ${enrolled 
                                 ? 'border-green-400 shadow-lg' 
                                 : 'border-gray-100 hover:border-blue-300 hover:shadow-xl'}`}
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                          Grade {classData.grade}
                        </span>
                        {enrolled ? (
                          <span className="flex items-center gap-1 text-green-300 text-sm">
                            <Unlock className="w-4 h-4" />
                            Enrolled
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-white/70 text-sm">
                            <Lock className="w-4 h-4" />
                            Locked
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {classData.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 sinhala-text">
                        {classData.nameSinhala}
                      </p>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {classData.description}
                      </p>

                      {/* Features */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {classData.lessons.length} Lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {classData.enrolledStudents.length} Students
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-blue-700">
                            Rs. {classData.price.toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-sm">/{classData.type === 'monthly' ? 'month' : 'course'}</span>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full
                                        ${classData.type === 'monthly' 
                                          ? 'bg-blue-100 text-blue-700' 
                                          : 'bg-amber-100 text-amber-700'}`}>
                          {classData.type === 'monthly' ? 'Monthly' : 'Special'}
                        </span>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (enrolled) {
                            onNavigate('my-classes', classData.id);
                          } else {
                            onNavigate('store');
                          }
                        }}
                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300
                                   ${enrolled 
                                     ? 'bg-green-500 text-white hover:bg-green-600' 
                                     : 'bg-blue-700 text-white hover:bg-blue-600'}`}
                      >
                        {enrolled ? (
                          <>
                            Access Lessons
                            <ChevronRight className="w-5 h-5" />
                          </>
                        ) : (
                          <>
                            Enroll Now
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              });
            })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('store')}
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Classes
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default GradeClasses;
