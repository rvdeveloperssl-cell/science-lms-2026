// ============================================
// NOTES & PAST PAPERS SECTION
// Study materials and resources
// ============================================

import React from 'react';
import { FileText, Download, BookOpen, Lock } from 'lucide-react';

const Notes: React.FC = () => {
  const resources = [
    {
      grade: 6,
      title: 'Grade 6 Science Notes',
      sinhalaTitle: '6 ශ්‍රේණිය විද්‍යා සටහන්',
      items: [
        { name: 'Introduction to Science', type: 'pdf', size: '2.5 MB' },
        { name: 'Living Things', type: 'pdf', size: '3.1 MB' },
        { name: 'Materials', type: 'pdf', size: '2.8 MB' },
      ]
    },
    {
      grade: 7,
      title: 'Grade 7 Science Notes',
      sinhalaTitle: '7 ශ්‍රේණිය විද්‍යා සටහන්',
      items: [
        { name: 'Human Body Systems', type: 'pdf', size: '4.2 MB' },
        { name: 'Plants and Photosynthesis', type: 'pdf', size: '3.5 MB' },
      ]
    },
    {
      grade: 8,
      title: 'Grade 8 Science Notes',
      sinhalaTitle: '8 ශ්‍රේණිය විද්‍යා සටහන්',
      items: [
        { name: 'Forces and Motion', type: 'pdf', size: '3.8 MB' },
        { name: 'Energy Transformations', type: 'pdf', size: '4.1 MB' },
      ]
    },
    {
      grade: 9,
      title: 'Grade 9 Science Notes',
      sinhalaTitle: '9 ශ්‍රේණිය විද්‍යා සටහන්',
      items: [
        { name: 'Atomic Structure', type: 'pdf', size: '5.2 MB' },
        { name: 'Chemical Reactions', type: 'pdf', size: '4.8 MB' },
      ]
    },
    {
      grade: 10,
      title: 'Grade 10 O/L Notes',
      sinhalaTitle: '10 ශ්‍රේණිය සා.පෙළ සටහන්',
      items: [
        { name: 'Physics - Mechanics', type: 'pdf', size: '6.5 MB' },
        { name: 'Chemistry - Acids & Bases', type: 'pdf', size: '5.8 MB' },
        { name: 'Biology - Cell Biology', type: 'pdf', size: '7.2 MB' },
      ]
    },
    {
      grade: 11,
      title: 'Grade 11 O/L Notes',
      sinhalaTitle: '11 ශ්‍රේණිය සා.පෙළ සටහන්',
      items: [
        { name: 'Physics - Electricity', type: 'pdf', size: '6.8 MB' },
        { name: 'Chemistry - Organic Chemistry', type: 'pdf', size: '7.5 MB' },
        { name: 'Biology - Genetics', type: 'pdf', size: '8.1 MB' },
      ]
    },
  ];

  const pastPapers = [
    { year: '2024', type: 'Model Paper', grade: 11 },
    { year: '2023', type: 'Past Paper', grade: 11 },
    { year: '2023', type: 'Past Paper', grade: 10 },
    { year: '2022', type: 'Past Paper', grade: 11 },
    { year: '2022', type: 'Past Paper', grade: 10 },
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-4">
            Study Materials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notes & <span className="text-gradient">Past Papers</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto sinhala-text">
            විද්‍යා විෂයය සඳහා සම්පූර්ණ සටහන් සහ පසුගිය ප්‍රශ්න පත්‍ර
          </p>
        </div>

        {/* Grade-wise Notes */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Grade-wise Notes
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">Grade {resource.grade}</span>
                    <span className="px-2 py-1 bg-white/20 text-white text-xs rounded">
                      {resource.items.length} Files
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{resource.title}</h4>
                  <p className="text-gray-500 text-sm mb-4 sinhala-text">{resource.sinhalaTitle}</p>
                  
                  <div className="space-y-2">
                    {resource.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{item.size}</span>
                          <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Papers */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-600" />
            Past Papers & Model Papers
          </h3>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Year</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Grade</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pastPapers.map((paper, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{paper.year}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full
                                        ${paper.type === 'Model Paper' 
                                          ? 'bg-blue-100 text-blue-700' 
                                          : 'bg-green-100 text-green-700'}`}>
                          {paper.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">Grade {paper.grade}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Premium Content</h4>
            <p className="text-gray-600 text-sm mb-2">
              Full access to all notes and past papers is available for enrolled students only. 
              Enroll in a class to unlock all study materials.
            </p>
            <p className="text-gray-600 text-sm sinhala-text">
              සියලුම සටහන් සහ ප්‍රශ්න පත්‍ර සඳහා ප්‍රවේශය පන්තියට සම්බන්ධ වූ සිසුන්ට පමණි.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notes;
