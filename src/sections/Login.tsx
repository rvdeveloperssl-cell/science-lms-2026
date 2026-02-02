// ============================================
// LOGIN & REGISTRATION SECTION
// Student and Admin Integrated Authentication
// ============================================

import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

// Extend the register data type locally to include new fields
interface ExtendedRegisterData {
  fullName: string;
  mobileNumber: string;
  email?: string;
  grade: number;
  password: string;
  nicNumber: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  bankSlipUrl?: string;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'register'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    studentId: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    nicNumber: '',
    gender: '',
    grade: 6,
    password: '',
    confirmPassword: '',
    parentName: '',
    parentPhone: '',
    bankSlip: null as File | null
  });

  const { login, adminLogin, register } = useAuth();

  const handleIntegratedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      if (loginData.studentId.toLowerCase() === 'admin' && loginData.password === 'kalana2026') {
        const success = adminLogin(loginData.studentId, loginData.password);
        if (success) {
          setMessage({ type: 'success', text: 'Admin access granted!' });
          setTimeout(() => onNavigate('admin'), 1000);
          setLoading(false);
          return;
        }
      }

      const success = login(loginData.studentId, loginData.password);
      if (success) {
        setMessage({ type: 'success', text: 'Login successful!' });
        setTimeout(() => onNavigate('dashboard'), 1000);
      } else {
        setMessage({ type: 'error', text: 'Invalid Student ID or password' });
      }
      setLoading(false);
    }, 500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // FIX: Cast to ExtendedRegisterData to include new fields
      const result = register({
        fullName: registerData.fullName,
        mobileNumber: registerData.mobileNumber,
        email: registerData.email || undefined,
        grade: registerData.grade,
        password: registerData.password,
        nicNumber: registerData.nicNumber,
        gender: registerData.gender,
        parentName: registerData.parentName,
        parentPhone: registerData.parentPhone,
        bankSlipUrl: registerData.bankSlip ? URL.createObjectURL(registerData.bankSlip) : undefined
      } as ExtendedRegisterData);  // <-- THIS FIXES THE ERROR

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          setActiveTab('student');
          setLoginData({ ...loginData, studentId: result.studentId || '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <section className="section-padding bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Portal <span className="text-gradient">Login</span>
          </h2>
          <p className="text-gray-600">
            {activeTab === 'register'
              ? 'Create your account to start learning'
              : 'Access your dashboard and video lessons'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'student' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'
              }`}>
              Student Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'
              }`}>
              Register
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {/* Forms Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {activeTab === 'student' && (
            <form onSubmit={handleIntegratedLogin} className="space-y-6">
              <div>
                <label className="form-label">Student ID</label>
                <input
                  type="text"
                  placeholder="e.g., SK-2026-0001"
                  value={loginData.studentId}
                  onChange={(e) => setLoginData({ ...loginData, studentId: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="form-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Row 1: Full Name & Mobile */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="07x xxxxxxx"
                    value={registerData.mobileNumber}
                    onChange={(e) => setRegisterData({ ...registerData, mobileNumber: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email & NIC */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">NIC Number *</label>
                  <input
                    type="text"
                    placeholder="2001xxxxxxxV / 99xxxxxxxV"
                    value={registerData.nicNumber}
                    onChange={(e) => setRegisterData({ ...registerData, nicNumber: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Gender & Grade */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Gender *</label>
                  <select
                    value={registerData.gender}
                    onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Grade *</label>
                  <select
                    value={registerData.grade}
                    onChange={(e) => setRegisterData({ ...registerData, grade: Number(e.target.value) })}
                    className="form-input"
                    required
                  >
                    {[6, 7, 8, 9, 10, 11].map((g) => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Parent/Guardian Details */}
              <div className="border-t pt-6 mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Parent / Guardian Details</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Parent/Guardian Name *</label>
                    <input
                      type="text"
                      placeholder="Father's/Mother's name"
                      value={registerData.parentName}
                      onChange={(e) => setRegisterData({ ...registerData, parentName: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Parent/Guardian Phone *</label>
                    <input
                      type="tel"
                      placeholder="07x xxxxxxx"
                      value={registerData.parentPhone}
                      onChange={(e) => setRegisterData({ ...registerData, parentPhone: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Password & Confirm */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="form-input"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                {loading ? "Registering..." : "Register Now"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Support: <span className="text-blue-600 font-medium">077 019 4054</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
