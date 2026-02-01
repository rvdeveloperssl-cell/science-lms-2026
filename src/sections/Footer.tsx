// ============================================
// FOOTER COMPONENT
// Website footer with RV Developers credit
// ============================================

import React from 'react';
import { Facebook, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const quickLinks = [
    { label: 'Home', page: 'home' },
    { label: 'About Teacher', page: 'about' },
    { label: 'Classes', page: 'grades' },
    { label: 'Store', page: 'store' },
    { label: 'Contact', page: 'contact' },
  ];

  const resources = [
    { label: 'Video Lessons', page: 'videos' },
    { label: 'Live Schedule', page: 'schedule' },
    { label: 'Notes & Papers', page: 'notes' },
    { label: 'Student Login', page: 'login' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SK</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Science with Kalana</h3>
                <p className="text-gray-400 text-sm sinhala-text">විද්‍යා පන්තිය</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Making science accessible and enjoyable for students from Grade 6 to O/L.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61585594877307" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/94770194054"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => onNavigate(link.page)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => onNavigate(link.page)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>77 019 4054</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@sciencewithkalana.lk</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Science with Kalana. All rights reserved.
            </p>

            {/* RV Developers Credit */}
            <a
              href="https://www.facebook.com/profile.php?id=61585594877307"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="text-right">
                <p className="text-gray-500 text-xs">Developed by</p>
                <p className="text-amber-400 font-semibold text-sm group-hover:text-amber-300 transition-colors">
                  RV Developers
                </p>
              </div>
              <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="https://i.postimg.cc/4d76Jq41/RV-DEVELOPERS-LOGO.jpg" 
                  alt="RV Developers"
                  className="w-full h-full object-cover"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
