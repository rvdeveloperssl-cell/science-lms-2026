// ============================================
// WHATSAPP FLOATING BUTTON
// Quick contact via WhatsApp
// ============================================

import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '94770194054'; // 77 019 4054 with country code
  const message = encodeURIComponent('Hi, I would like to know more about Science with Kalana classes.');
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 
                 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl 
                 transition-all duration-300 hover:scale-110 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm 
                       rounded-lg opacity-0 group-hover:opacity-100 transition-opacity 
                       whitespace-nowrap pointer-events-none">
        Chat on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
