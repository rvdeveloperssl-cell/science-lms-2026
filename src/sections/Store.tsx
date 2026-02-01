// ============================================
// STORE / ALL CLASSES PAGE
// Shows all available classes with enrollment options
// ============================================

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShoppingCart, Filter, Search, CheckCircle } from 'lucide-react';
import { getClasses, getPaymentsByStudent } from '@/data/store';
import { useAuth } from '@/context/AuthContext';
import type { Class } from '@/types';

interface StoreProps {
  onNavigate: (page: string, classId?: string) => void;
}

const Store: React.FC<StoreProps> = ({ onNavigate }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'monthly' | 'special'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledClasses, setEnrolledClasses] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    setClasses(getClasses());
    if (currentUser) {
      const payments = getPaymentsByStudent(currentUser.id);
      const completedPayments = payments
        .filter(p => p.status === 'completed')
        .map(p => p.classId);
      setEnrolledClasses(completedPayments);
    }
  }, [currentUser]);

  const filteredClasses = classes.filter(classData => {
    const matchesGrade = filterGrade === 'all' || classData.grade === filterGrade;
    const matchesType = filterType === 'all' || classData.type === filterType;
    const matchesSearch = 
      classData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classData.nameSinhala.includes(searchQuery);
    return matchesGrade && matchesType && matchesSearch && classData.isActive;
  });

  const isEnrolled = (classId: string) => {
    return enrolledClasses.includes(classId);
  };

  const handleEnroll = (classId: string) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    onNavigate('payment', classId);
  };

  return (
    <section className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All <span className="text-gradient">Classes</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse and enroll in our comprehensive science classes for grades 6-11
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="all">All Grades</option>
                {[6, 7, 8, 9, 10, 11].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'monthly' | 'special')}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="all">All Types</option>
                <option value="monthly">Monthly</option>
                <option value="special">Special</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''}
        </p>

        {/* Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classData) => {
            const enrolled = isEnrolled(classData.id);
            
            return (
              <div 
                key={classData.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300
                           ${enrolled ? 'ring-2 ring-green-400' : 'hover:shadow-xl'}`}
              >
                {/* Image/Header */}
                <div className={`h-32 flex items-center justify-center relative
                               ${classData.grade <= 8 
                                 ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                                 : 'bg-gradient-to-br from-amber-400 to-orange-500'}`}>
                  <div className="text-center text-white">
                    <span className="text-5xl font-bold">{classData.grade}</span>
                    <p className="text-white/80">Grade</p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {enrolled ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Enrolled
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
                        <Lock className="w-4 h-4" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{classData.name}</h3>
                      <p className="text-sm text-gray-500 sinhala-text">{classData.nameSinhala}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full
                                    ${classData.type === 'monthly' 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-amber-100 text-amber-700'}`}>
                      {classData.type}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {classData.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {classData.lessons.length} Lessons
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {classData.enrolledStudents.length} Students
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      Video Access
                    </span>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-blue-700">
                        Rs. {classData.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm">/{classData.type === 'monthly' ? 'mo' : 'course'}</span>
                    </div>
                    
                    <button
                      onClick={() => enrolled ? onNavigate('my-classes', classData.id) : handleEnroll(classData.id)}
                      disabled={enrolled}
                      className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all
                                 ${enrolled 
                                   ? 'bg-green-500 text-white cursor-default' 
                                   : 'bg-blue-700 text-white hover:bg-blue-600'}`}
                    >
                      {enrolled ? (
                        <>
                          <Unlock className="w-4 h-4" />
                          Access
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Buy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No classes found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Store;
