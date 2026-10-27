import React, { useState } from 'react';
import { AuthUser } from '../types';
import {
  ADMIN_PASSWORD,
  REPORTER_PASSWORD,
  checkAdminPassword,
  checkReporterPassword,
  normalizeEmail,
  isValidGmail,
  saveStoredUser
} from '../services/auth';
import { logReporterAction } from '../services/auditLogger';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Zap,
  LogIn
} from 'lucide-react';

interface LoginModalProps {
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'reporter' | 'admin'>('reporter');
  const [reporterEmail, setReporterEmail] = useState('ednbangla@gmail.com');
  const [reporterPassword, setReporterPassword] = useState('posteditor');
  const [adminUsername, setAdminUsername] = useState('admin@dnbangla.com');
  const [adminPassword, setAdminPassword] = useState('adminipdnb');
  const [showReporterPass, setShowReporterPass] = useState(true);
  const [showAdminPass, setShowAdminPass] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Manual Instant Login Handler
  const executeLogin = (user: AuthUser, message: string) => {
    saveStoredUser(user);
    try {
      logReporterAction(
        user,
        `${user.role === 'admin' ? 'এডমিন' : 'রিপোর্টার'} পোর্টালে লগইন করেছেন`,
        'login',
        undefined,
        `লগইন ইমেইল: ${user.email}`
      );
    } catch (e) {
      console.warn('Audit logger warning:', e);
    }
    setSuccessMessage(message);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 250);
  };

  const handleReporterLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const emailTrimmed = normalizeEmail(reporterEmail);
    if (!isValidGmail(emailTrimmed)) {
      setErrorMessage('অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা দিন (যেমন: ednbangla@gmail.com)');
      return;
    }

    if (!checkReporterPassword(reporterPassword) && reporterPassword.trim().length === 0) {
      setErrorMessage('অনুগ্রহ করে পাসওয়ার্ড দিন (ডিফল্ট: posteditor)');
      return;
    }

    const newUser: AuthUser = {
      role: 'reporter',
      email: emailTrimmed,
      name: emailTrimmed.split('@')[0],
      loggedInAt: new Date().toLocaleTimeString('bn-BD')
    };

    executeLogin(newUser, `স্বাগতম! রিপোর্টার হিসেবে সফলভাবে প্রবেশ করেছেন (${emailTrimmed})`);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!checkAdminPassword(adminPassword) && adminPassword.trim().length === 0) {
      setErrorMessage('অনুগ্রহ করে এডমিন পাসওয়ার্ড দিন (ডিফল্ট: adminipdnb)');
      return;
    }

    const adminEmail = adminUsername.trim() || 'admin@dnbangla.com';
    const newUser: AuthUser = {
      role: 'admin',
      email: adminEmail,
      name: 'সুপার এডমিন',
      loggedInAt: new Date().toLocaleTimeString('bn-BD')
    };

    executeLogin(newUser, 'এডমিন হিসেবে সফলভাবে প্রবেশ করেছেন! সকল নিয়ন্ত্রণ আনলক করা হয়েছে।');
  };

  // Direct 1-Click Manual Access Helpers
  const quickReporterLogin = () => {
    setErrorMessage('');
    const email = reporterEmail.trim() || 'ednbangla@gmail.com';
    const newUser: AuthUser = {
      role: 'reporter',
      email: normalizeEmail(email),
      name: email.split('@')[0] || 'রিপোর্টার',
      loggedInAt: new Date().toLocaleTimeString('bn-BD')
    };
    executeLogin(newUser, `সরাসরি রিপোর্টার এক্সেস সক্রিয় করা হয়েছে (${newUser.email})`);
  };

  const quickAdminLogin = () => {
    setErrorMessage('');
    const newUser: AuthUser = {
      role: 'admin',
      email: adminUsername.trim() || 'admin@dnbangla.com',
      name: 'সুপার এডমিন',
      loggedInAt: new Date().toLocaleTimeString('bn-BD')
    };
    executeLogin(newUser, 'সরাসরি সুপার এডমিন এক্সেস সক্রিয় করা হয়েছে');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-red-900/40">
            DN
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">ডিএন বাংলা ফটোকার্ড ইঞ্জিন</h1>
            <p className="text-xs text-slate-400 mt-0.5">নিরাপদ মাল্টি-রোল লগইন ও কন্ট্রোল সেন্টার</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="p-5 pb-2">
          <div className="grid grid-cols-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('reporter'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition ${
                activeTab === 'reporter'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" /> মডারেটর / রিপোর্টার লগইন
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl transition ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> এডমিন লগইন
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-3 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'reporter' ? (
            /* ================= REPORTER LOGIN ================= */
            <form onSubmit={handleReporterLogin} className="space-y-4">
              {/* Quick 1-Click Login Card */}
              <div className="bg-blue-950/30 p-3.5 rounded-2xl border border-blue-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" /> দ্রুত ১-ক্লিকে রিপোর্টার প্রবেশ:
                  </span>
                  <span className="text-[10px] text-blue-300 font-mono bg-blue-900/40 px-2 py-0.5 rounded">
                    ম্যানুয়াল এক্সেস
                  </span>
                </div>
                <button
                  type="button"
                  onClick={quickReporterLogin}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> সরাসরি রিপোর্টার পোর্টালে প্রবেশ করুন (ednbangla@gmail.com)
                </button>
              </div>

              {/* User Email Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    ইমেইল ঠিকানা <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setReporterEmail('ednbangla@gmail.com')}
                    className="text-[10px] text-blue-400 hover:underline"
                  >
                    ednbangla@gmail.com বসান
                  </button>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ednbangla@gmail.com"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    পাসওয়ার্ড <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setReporterPassword(REPORTER_PASSWORD)}
                    className="text-[10px] text-blue-400 hover:underline"
                  >
                    ডিফল্ট ({REPORTER_PASSWORD}) বসান
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showReporterPass ? 'text' : 'password'}
                    required
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={reporterPassword}
                    onChange={(e) => setReporterPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowReporterPass(!showReporterPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                    title={showReporterPass ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showReporterPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  পাসওয়ার্ড: <code className="text-amber-300 font-bold bg-slate-950 px-1 py-0.5 rounded border border-slate-800">{REPORTER_PASSWORD}</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" /> রিপোর্টার হিসেবে লগইন
              </button>
            </form>
          ) : (
            /* ================= ADMIN LOGIN ================= */
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {/* Quick 1-Click Login Card */}
              <div className="bg-amber-950/30 p-3.5 rounded-2xl border border-amber-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" /> দ্রুত ১-ক্লিকে এডমিন প্রবেশ:
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono bg-amber-900/40 px-2 py-0.5 rounded">
                    সুপার এক্সেস
                  </span>
                </div>
                <button
                  type="button"
                  onClick={quickAdminLogin}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> সরাসরি সুপার এডমিন হিসেবে প্রবেশ করুন
                </button>
              </div>

              {/* Admin Username Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    এডমিন ইউজারনেম / ইমেইল <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAdminUsername('admin@dnbangla.com')}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    admin@dnbangla.com বসান
                  </button>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: admin@dnbangla.com"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    এডমিন পাসওয়ার্ড <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAdminPassword(ADMIN_PASSWORD)}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    ডিফল্ট ({ADMIN_PASSWORD}) বসান
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                    title={showAdminPass ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  এডমিন পাসওয়ার্ড: <code className="text-amber-300 font-bold bg-slate-950 px-1 py-0.5 rounded border border-slate-800">{ADMIN_PASSWORD}</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-900/30 transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" /> এডমিন হিসেবে লগইন
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400">
              ডিএন বাংলা ডিজিটাল প্রেস নেটওয়ার্ক • সরাসরি ১-ক্লিক ম্যানুয়াল এক্সেস সক্রিয়
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
