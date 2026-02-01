// ============================================
// LIVE CLASS SCHEDULE SECTION
// Shows upcoming live classes
// ============================================

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ExternalLink, Bell } from 'lucide-react';
import { getLiveClasses, getClasses } from '@/data/store';
import type { LiveClass, Class } from '@/types';

const LiveSchedule: React.FC = () => {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    setLiveClasses(getLiveClasses());
    setClasses(getClasses());
  }, []);

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    return classData ? classData.name : 'Unknown Class';
  };

  const getClassGrade = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    return classData ? classData.grade : 0;
  };

  // Sort by date
  const sortedClasses = [...liveClasses].sort((a, b) => 
    new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
  );

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">
            Live Sessions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Live Class <span className="text-gradient">Schedule</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto sinhala-text">
            සජීවී පන්ති කාලසටහන - නොමිසේම සම්බන්ධ වන්න
          </p>
        </div>

        {/* Upcoming Classes */}
        <div className="max-w-4xl mx-auto">
          {sortedClasses.length > 0 ? (
            <div className="space-y-6">
              {sortedClasses.map((liveClass) => (
                <div 
                  key={liveClass.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Date Box */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 md:w-48 flex flex-col items-center justify-center text-white">
                      <Calendar className="w-8 h-8 mb-2 opacity-80" />
                      <span className="text-3xl font-bold">
                        {new Date(liveClass.date).getDate()}
                      </span>
                      <span className="text-blue-200 text-sm">
                        {new Date(liveClass.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Grade {getClassGrade(liveClass.classId)}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 text-sm">
                              <Clock className="w-4 h-4" />
                              {liveClass.time} ({liveClass.duration})
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {liveClass.title}
                          </h3>
                          <p className="text-gray-500 text-sm mb-3">
                            {getClassName(liveClass.classId)}
                          </p>
                        </div>

                        {/* Join Button */}
                        {liveClass.meetingLink && (
                          <a
                            href={liveClass.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                          >
                            <Video className="w-5 h-5" />
                            Join Live
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Classes */
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Live Classes</h3>
              <p className="text-gray-500 mb-4">Check back later for new schedule updates</p>
              
              {/* Notification Bell */}
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Bell className="w-5 h-5" />
                <span className="text-sm">Enable notifications to get alerts</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Interactive Sessions</h4>
            <p className="text-gray-600 text-sm">Ask questions and get answers in real-time</p>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Regular Schedule</h4>
            <p className="text-gray-600 text-sm">Consistent timing every week</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Get Notified</h4>
            <p className="text-gray-600 text-sm">Never miss a class with reminders</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSchedule;
