// ============================================
// ABOUT TEACHER SECTION
// Teacher profile and credentials
// ============================================

import React from 'react';
import { GraduationCap, Award, BookOpen, Users, Star, CheckCircle } from 'lucide-react';

const AboutTeacher: React.FC = () => {
  const qualifications = [
    'BSc (Hons) in Science Education',
    'Postgraduate Diploma in Education',
    '10+ Years Teaching Experience',
    'Former Government School Teacher'
  ];

  const achievements = [
    { icon: Users, value: '500+', label: 'Students Taught' },
    { icon: Award, value: '95%', label: 'O/L Pass Rate' },
    { icon: Star, value: 'A', label: 'Grade Results' },
    { icon: BookOpen, value: '15+', label: 'Years Experience' },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-white to-blue-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            Meet Your Instructor
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-gradient">Teacher Kalana</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto sinhala-text">
            විද්‍යා විෂයය ඔබට කිටිමට සහ ආදරය කිරීමට මග පෙන්වන අත්දැකීම්බර ගුරුවරයා
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Background Decoration */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-blue-200 rounded-2xl" />
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-amber-200 rounded-2xl" />
              
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 
                              shadow-xl overflow-hidden">
                {/* Teacher Avatar */}
                <div className="w-48 h-48 mx-auto bg-white rounded-full flex items-center justify-center mb-6">
                  <GraduationCap className="w-24 h-24 text-blue-700" />
                </div>
                
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-1">Kalana Sir</h3>
                  <p className="text-blue-200 mb-4 sinhala-text">විද්‍යා ගුරුවරයා</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Dedicated to Making Science Accessible
            </h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              With over 15 years of experience in teaching Science, I have helped hundreds of 
              students achieve their academic goals. My teaching philosophy centers on making 
              complex scientific concepts easy to understand through practical examples and 
              engaging lessons.
            </p>
            
            <p className="text-gray-600 mb-6 leading-relaxed sinhala-text">
              විද්‍යාව යනු බිහිතවූ විෂයක් නොවේ. නිවැරදි මඟපෙන්වීමෙන් සහ ප්‍රායෝගික උදාහරණ 
              මගින් සෑම ශිෂ්‍යයෙකුටම A සමත් වීමට හැකියාව ඇත. මගේ පන්තියේදී අපි 
              හදවතින්ම ඉගෙන ගනිමු.
            </p>

            {/* Qualifications */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h4>
              <div className="space-y-3">
                {qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{qual}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {achievements.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center p-4 bg-white rounded-xl shadow-md">
                    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeacher;
