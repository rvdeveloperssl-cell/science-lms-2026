import React, { useState } from 'react';
import { Save, ShieldCheck, UserCircle, Edit2, Copy, Check, QrCode, Download, User, Mail, Phone, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    mobileNumber: currentUser?.mobileNumber || '',
    grade: currentUser?.grade || 'Grade 10',
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentUser?.id}`;

  const copyToClipboard = () => {
    if (currentUser?.id) {
      navigator.clipboard.writeText(currentUser.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = async () => {
    const response = await fetch(qrImageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_${currentUser?.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  if (!currentUser) {
    return (
      <div className="pt-32 text-center flex flex-col items-center gap-4">
        <UserCircle className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 font-medium">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <section className="section-padding min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-10 text-center relative">
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <span className="text-white text-4xl font-black">
                  {formData.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 p-2 rounded-full border-2 border-white shadow-lg">
                <Edit2 className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-white text-2xl font-bold mt-4">{formData.fullName}</h2>
            
            <div className="flex flex-col items-center gap-2 mt-3">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-3">
                <span className="text-blue-100 text-xs font-mono tracking-wider">
                  ID: {currentUser.id}
                </span>
                <button onClick={copyToClipboard} className="text-blue-200 hover:text-white transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <button 
                onClick={() => setShowQR(!showQR)}
                className="mt-2 flex items-center gap-2 bg-white text-blue-800 px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-blue-50 transition-all"
              >
                <QrCode className="w-4 h-4" /> {showQR ? "Hide QR Code" : "Generate Student QR"}
              </button>
            </div>
          </div>

          <div className="p-8">
            {showQR && (
              <div className="mb-8 p-6 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center">
                <h4 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5" /> Your Digital ID Card QR
                </h4>
                <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
                  <img src={qrImageUrl} alt="Student QR Code" className="w-40 h-40" />
                </div>
                <button 
                  onClick={downloadQR}
                  className="flex items-center gap-2 text-sm bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" /> Download QR to Phone
                </button>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> 
                <span className="font-medium">Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Full Name</label>
                  <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="form-input" required />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Grade</label>
                  <select className="form-input" value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})}>
                    <option>Grade 6</option><option>Grade 7</option><option>Grade 8</option>
                    <option>Grade 9</option><option>Grade 10</option><option>Grade 11</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><Phone className="w-4 h-4" /> Mobile Number</label>
                  <input type="tel" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} className="form-input" required />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                {loading ? "Saving..." : <><Save className="w-5 h-5" /> Save Profile Details</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
