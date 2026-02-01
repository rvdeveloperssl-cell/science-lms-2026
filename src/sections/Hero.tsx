// ============================================
// HERO SECTION
// Main landing page with Sinhala headline
// ============================================

import React from 'react';
import { ArrowRight, Play, BookOpen, Users, Award } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const stats = [
    { icon: Users, value: '500+', label: 'Students' },
    { icon: BookOpen, value: '50+', label: 'Video Lessons' },
    { icon: Award, value: '95%', label: 'Pass Rate' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container-custom pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm">Classes Available for 2026</span>
            </div>
            
            {/* Main Headline - Sinhala */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sinhala-text">
              හදවත හා මොළය යා කරන
              <span className="block text-amber-400 mt-2">Science පන්තිය</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-xl mx-auto lg:mx-0">
              Master Science with confidence. From Grade 6 to O/L, 
              we make learning engaging and effective.
            </p>
            
            {/* Description - Sinhala */}
            <p className="text-base text-blue-200/80 mb-8 max-w-lg mx-auto lg:mx-0 sinhala-text">
              6 සිට 11 ශ්‍රේණි දක්වා විද්‍යා විෂයය සම්පූර්ණයෙන් ආවරණය කරමින් 
              ඔබගේ අධ්‍යාපනය ඉහළින් රැකදෙන විශ්වාසදායී පන්තිය
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button 
                onClick={() => onNavigate('register')}
                className="btn-gold flex items-center justify-center gap-2 group"
              >
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('store')}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                View Classes
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-blue-200">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <div className="hidden lg:flex justify-center items-center animate-slideInRight">
            <div className="relative">
              {/* Main Circle */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/30 to-amber-400/20 
                              backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/40 to-blue-600/30 
                                backdrop-blur-md border border-white/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-blue-700">SK</span>
                    </div>
                    <p className="text-white font-semibold">Science with</p>
                    <p className="text-amber-400 font-bold text-xl">Kalana</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl animate-bounce"
                   style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">New Lessons</p>
                    <p className="text-xs text-gray-500">Added Weekly</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl animate-bounce"
                   style={{ animationDuration: '3s', animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Top Results</p>
                    <p className="text-xs text-gray-500">Year after Year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
