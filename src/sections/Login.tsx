import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, CheckCircle, AlertCircle, User, Phone, Mail, CreditCard, Users, GraduationCap } from 'lucide-react';
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
    nicNumber: '',
    grade: 'Grade 10',
    parentName: '',
    parentNumber: '',
    password: '',
    confirmPassword: ''
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
    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      const result = register({
        fullName: registerData.fullName,
        mobileNumber: registerData.mobileNumber,
        email: registerData.email || undefined,
        grade: registerData.grade as any,
        password: registerData.password,
      });

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `Registration Successful! Your Student ID: ${result.studentId}. Please login now.` 
        });
        
        // --- මෙන්න මෙතනින් තමයි Register එක වහලා Login එකට හරවන්නේ ---
        setTimeout(() => {
          setActiveTab('student'); // Login tab එකට මාරු කරනවා
          setLoginData({ ...loginData, studentId: result.studentId || '' }); // ID එක auto පිරවෙනවා
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="section-padding bg-gradient-to-b from-blue-50 to-white min-h-screen pt-24">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Student <span className="text-gradient">Portal</span>
          </h2>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex shadow-inner">
            <button onClick={() => setActiveTab('student')} className={`px-8 py-2 rounded-md font-medium transition-all ${activeTab === 'student' ? 'bg-white text-blue-700 shadow-md' : 'text-gray-600'}`}>Login</button>
            <button onClick={() => setActiveTab('register')} className={`px-8 py-2 rounded-md font-medium transition-all ${activeTab === 'register' ? 'bg-white text-blue-700 shadow-md' : 'text-gray-600'}`}>Register</button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
          {activeTab === 'student' ? (
            <form onSubmit={handleIntegratedLogin} className="space-y-6">
              <div><label className="form-label font-semibold">Student ID</label><div className="relative"><User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"/><input type="text" placeholder="SK-2026-XXXX" value={loginData.studentId} onChange={(e) => setLoginData({ ...loginData, studentId: e.target.value })} className="form-input pl-10" required /></div></div>
              <div><label className="form-label font-semibold">Password</label><div className="relative"><input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="form-input pr-10" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2">{loading ? "Logging in..." : <><LogIn className="w-5 h-5" /> Sign In</>}</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-gray-700 mb-1 block">Full Name</label><input type="text" placeholder="Student Name" className="form-input" required value={registerData.fullName} onChange={e => setRegisterData({...registerData, fullName: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-gray-700 mb-1 block">NIC Number (Optional)</label><div className="relative"><CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400"/><input type="text" placeholder="NIC Number" className="form-input pl-10" value={registerData.nicNumber} onChange={e => setRegisterData({...registerData, nicNumber: e.target.value})} /></div></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-gray-700 mb-1 block">Mobile Number</label><div className="relative"><Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400"/><input type="tel" placeholder="07XXXXXXXX" className="form-input pl-10" required value={registerData.mobileNumber} onChange={e => setRegisterData({...registerData, mobileNumber: e.target.value})} /></div></div>
                <div><label className="text-sm font-bold text-gray-700 mb-1 block">Email Address</label><div className="relative"><Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400"/><input type="email" placeholder="example@mail.com" className="form-input pl-10" required value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} /></div></div>
              </div>

              <div><label className="text-sm font-bold text-gray-700 mb-1 block">Grade</label><div className="relative"><GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400"/><select className="form-input pl-10" value={registerData.grade} onChange={e => setRegisterData({...registerData, grade: e.target.value})}><option>Grade 10</option><option>Grade 11</option><option>Revision</option></select></div></div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-blue-800"><Users className="w-5 h-5"/> Parents' Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Parent Name" className="form-input bg-white" required value={registerData.parentName} onChange={e => setRegisterData({...registerData, parentName: e.target.value})} />
                  <input type="tel" placeholder="Parent Contact" className="form-input bg-white" required value={registerData.parentNumber} onChange={e => setRegisterData({...registerData, parentNumber: e.target.value})} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input type="password" placeholder="Create Password" className="form-input" required value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} />
                <input type="password" placeholder="Confirm Password" className="form-input" required value={registerData.confirmPassword} onChange={e => setRegisterData({...registerData, confirmPassword: e.target.value})} />
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all">{loading ? "Registering..." : "Create Account"}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;
