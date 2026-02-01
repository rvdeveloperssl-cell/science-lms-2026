import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'register'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [loginData, setLoginData] = useState({
    studentId: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    grade: 6,
    password: '',
    confirmPassword: '',
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
      const result = register({
        fullName: registerData.fullName,
        mobileNumber: registerData.mobileNumber,
        email: registerData.email || undefined,
        grade: registerData.grade,
        password: registerData.password,
        bankSlipUrl: registerData.bankSlip ? URL.createObjectURL(registerData.bankSlip) : undefined
      });

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
      <div className="container-custom max-w-4xl pt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Portal <span className="text-gradient">Login</span>
          </h2>
          <p className="text-gray-600">
            {activeTab === 'register' ? 'Create your account' : 'Access your dashboard'}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button onClick={() => setActiveTab('student')} className={`px-6 py-2 rounded-md font-medium ${activeTab === 'student' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}>Student Login</button>
            <button onClick={() => setActiveTab('register')} className={`px-6 py-2 rounded-md font-medium ${activeTab === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}>Register</button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {activeTab === 'student' ? (
            <form onSubmit={handleIntegratedLogin} className="space-y-6">
              <div><label className="form-label">Student ID</label><input type="text" placeholder="e.g., SK-2026-0001" value={loginData.studentId} onChange={(e) => setLoginData({ ...loginData, studentId: e.target.value })} className="form-input" required /></div>
              <div><label className="form-label">Password</label><div className="relative"><input type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="form-input pr-10" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 bg-blue-600 text-white rounded-lg flex justify-center items-center gap-2">{loading ? "Processing..." : <><LogIn className="w-5 h-5" /> Login</>}</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="form-label">Full Name *</label><input type="text" value={registerData.fullName} onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })} className="form-input" required /></div>
                <div><label className="form-label">Mobile Number *</label><input type="tel" value={registerData.mobileNumber} onChange={(e) => setRegisterData({ ...registerData, mobileNumber: e.target.value })} className="form-input" required /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="form-label">Password *</label><input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} className="form-input" required minLength={6} /></div>
                <div><label className="form-label">Confirm Password *</label><input type="password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} className="form-input" required /></div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold">{loading ? "Registering..." : "Register Now"}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;
