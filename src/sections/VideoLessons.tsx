// ============================================
// RECORDED VIDEO LESSONS SECTION
// Shows available video lessons
// ============================================

import React, { useState, useEffect } from 'react';
import { Play, Lock, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { getClasses, getPaymentsByStudent } from '@/data/store';
import { useAuth } from '@/context/AuthContext';
import type { Class, Lesson } from '@/types';

interface VideoLessonsProps {
  onNavigate: (page: string) => void;
}

const VideoLessons: React.FC<VideoLessonsProps> = ({ onNavigate }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [enrolledClassIds, setEnrolledClassIds] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const allClasses = getClasses();
    setClasses(allClasses);
    
    if (currentUser) {
      const payments = getPaymentsByStudent(currentUser.id);
      const completedPayments = payments
        .filter(p => p.status === 'completed')
        .map(p => p.classId);
      setEnrolledClassIds(completedPayments);
    }
  }, [currentUser]);

  const enrolledClasses = classes.filter(c => enrolledClassIds.includes(c.id));

  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            Video Library
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recorded <span className="text-gradient">Video Lessons</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto sinhala-text">
            ඔබගේ පන්තිවල සියලුම වීඩියෝ පාඩම් මෙතනින් නරඹන්න
          </p>
        </div>

        {!currentUser ? (
          /* Not Logged In */
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Login Required</h3>
            <p className="text-gray-500 mb-6">Please login to access your video lessons</p>
            <button 
              onClick={() => onNavigate('login')}
              className="btn-primary"
            >
              Login Now
            </button>
          </div>
        ) : enrolledClasses.length === 0 ? (
          /* No Enrolled Classes */
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Classes</h3>
            <p className="text-gray-500 mb-6 sinhala-text">ඔබට සක්‍රීය පන්ති නොමැත. කරුණාකර පන්තියක් මිලදී ගන්න.</p>
            <button 
              onClick={() => onNavigate('store')}
              className="btn-primary"
            >
              Browse Classes
            </button>
          </div>
        ) : (
          /* Video Content */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              {selectedLesson ? (
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  {/* Player */}
                  <div className="video-container rounded-t-2xl">
                    <iframe
                      src={selectedLesson.youtubeUrl}
                      title={selectedLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  
                  {/* Lesson Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {selectedLesson.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedLesson.title}
                    </h3>
                    <p className="text-gray-600 sinhala-text mb-2">
                      {selectedLesson.titleSinhala}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {selectedLesson.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Lesson</h3>
                  <p className="text-gray-500">Choose a lesson from the sidebar to start watching</p>
                </div>
              )}
            </div>

            {/* Lesson List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Lessons</h3>
              
              {enrolledClasses.map((classData) => (
                <div key={classData.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Class Header */}
                  <button
                    onClick={() => setSelectedClass(selectedClass === classData.id ? null : classData.id)}
                    className="w-full px-4 py-3 bg-blue-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900 text-sm">{classData.name}</span>
                    </div>
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        selectedClass === classData.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>

                  {/* Lessons */}
                  {selectedClass === classData.id && (
                    <div className="divide-y divide-gray-100">
                      {classData.lessons.length > 0 ? (
                        classData.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors
                                       ${selectedLesson?.id === lesson.id ? 'bg-blue-50' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                           ${selectedLesson?.id === lesson.id 
                                             ? 'bg-blue-600 text-white' 
                                             : 'bg-gray-100 text-gray-600'}`}>
                              <Play className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className={`text-sm font-medium line-clamp-1 ${
                                selectedLesson?.id === lesson.id ? 'text-blue-700' : 'text-gray-900'
                              }`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.duration}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-center text-gray-500 text-sm">
                          No lessons available yet
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoLessons;
