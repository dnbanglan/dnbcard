import React, { useState, useMemo } from 'react';
import { AuditLogItem } from '../types';
import { clearAllAuditLogs, resetAuditLogsToSample } from '../services/auditLogger';
import { 
  Users, 
  Download, 
  Newspaper, 
  Filter, 
  Search, 
  Trash2, 
  RotateCcw, 
  FileSpreadsheet, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface ReporterAuditViewProps {
  logs: AuditLogItem[];
  onRefreshLogs: () => void;
  onSelectHeadline?: (headline: string) => void;
}

export const ReporterAuditView: React.FC<ReporterAuditViewProps> = ({
  logs,
  onRefreshLogs,
  onSelectHeadline
}) => {
  const [selectedReporter, setSelectedReporter] = useState<string>('all');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get unique list of reporters
  const uniqueReporters = useMemo(() => {
    const set = new Set<string>();
    logs.forEach(l => {
      if (l.reporterEmail) set.add(l.reporterEmail);
    });
    return Array.from(set);
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(item => {
      if (selectedReporter !== 'all' && item.reporterEmail !== selectedReporter) {
        return false;
      }
      if (selectedActionType !== 'all' && item.actionType !== selectedActionType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const headlineMatch = item.headline?.toLowerCase().includes(q);
        const emailMatch = item.reporterEmail.toLowerCase().includes(q);
        const actionMatch = item.action.toLowerCase().includes(q);
        const detailsMatch = item.details?.toLowerCase().includes(q);
        if (!headlineMatch && !emailMatch && !actionMatch && !detailsMatch) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedReporter, selectedActionType, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = logs.length;
    const downloads = logs.filter(l => l.actionType === 'download').length;
    const reportersCount = uniqueReporters.filter(e => e.includes('@gmail.com')).length;
    
    // Find most active reporter
    const counts: Record<string, number> = {};
    logs.forEach(l => {
      counts[l.reporterEmail] = (counts[l.reporterEmail] || 0) + 1;
    });
    let topReporter = '—';
    let maxCount = 0;
    Object.entries(counts).forEach(([email, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        topReporter = email;
      }
    });

    return {
      total,
      downloads,
      reportersCount: reportersCount || 1,
      topReporter: topReporter !== '—' ? `${topReporter} (${maxCount}টি)` : '—'
    };
  }, [logs, uniqueReporters]);

  const handleExportCSV = () => {
    if (!filteredLogs.length) {
      alert('এক্সপোর্ট করার মতো কোনো লগ নেই।');
      return;
    }
    const headers = ['ID', 'Reporter Email', 'Role', 'Action', 'Action Type', 'Headline', 'Details', 'Timestamp', 'Date'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.reporterEmail}"`,
      l.role,
      `"${l.action.replace(/"/g, '""')}"`,
      l.actionType,
      `"${(l.headline || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      l.timestamp,
      l.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dnbangla_reporter_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLogs = () => {
    try {
      clearAllAuditLogs();
      onRefreshLogs();
    } catch (e) {
      console.warn('Failed to clear logs', e);
    }
  };

  const handleResetSample = () => {
    resetAuditLogsToSample();
    onRefreshLogs();
  };

  const getActionBadgeColor = (type: string) => {
    switch (type) {
      case 'download':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'load_news':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'edit':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'schedule_send':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'login':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Notice */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-900/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base md:text-lg">
                  রিপোর্টার অ্যাক্টিভিটি ট্র্যাকার ও অডিট ড্যাশবোর্ড
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  👑 শুধুমাত্র এডমিন অ্যাক্সেস
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                কোন রিপোর্টার (@gmail.com) কখন কোন ফটোকার্ড তৈরি করেছেন, কোন সংবাদ লোড করেছেন বা ডাউনলোড করেছেন তার লাইভ অডিট।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
              title="CSV ফাইলে ডাউনলোড করুন"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> CSV এক্সপোর্ট
            </button>
            <button
              onClick={handleResetSample}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="ডেমো রেকর্ড রিস্টোর"
            >
              <RotateCcw className="w-3.5 h-3.5" /> ডেমো ডাটা
            </button>
            <button
              onClick={handleClearLogs}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> অডিট পরিষ্কার
            </button>
          </div>
        </div>

        {/* 4 Analytics Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">মোট রেকর্ডকৃত কার্যক্রম</p>
              <h4 className="text-2xl font-bold text-white mt-1">{stats.total} টি</h4>
            </div>
            <div className="w-11 h-11 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">সক্রিয় রিপোর্টার অ্যাকাউন্ট</p>
              <h4 className="text-2xl font-bold text-amber-400 mt-1">{stats.reportersCount} জন</h4>
            </div>
            <div className="w-11 h-11 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">মোট ফটোকার্ড ডাউনলোড</p>
              <h4 className="text-2xl font-bold text-emerald-400 mt-1">{stats.downloads} টি</h4>
            </div>
            <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs text-slate-400">সর্বাধিক সক্রিয় রিপোর্টার</p>
              <h4 className="text-xs font-bold text-purple-300 mt-1 truncate" title={stats.topReporter}>
                {stats.topReporter}
              </h4>
            </div>
            <div className="w-11 h-11 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Reporter Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-400" /> রিপোর্টার ফিল্টার (@gmail.com):
            </label>
            <select
              value={selectedReporter}
              onChange={(e) => setSelectedReporter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">সকল রিপোর্টার ও ইউজার ({uniqueReporters.length} জন)</option>
              {uniqueReporters.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Action Category Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" /> কাজের ধরন:
            </label>
            <select
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">সকল কার্যক্রম (All Actions)</option>
              <option value="download">📥 ফটোকার্ড ডাউনলোড (HD Downloads)</option>
              <option value="load_news">📰 ওয়ার্ডপ্রেস সংবাদ লোড</option>
              <option value="edit">✏️ ডিজাইন ও হেডলাইন পরিবর্তন</option>
              <option value="schedule_send">⏰ শিডিউলার থেকে পাঠানো</option>
              <option value="login">🔑 লগইন হিস্টোরি</option>
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-emerald-400" /> হেডলাইন বা কীওয়ার্ড খুঁজুন:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="শিরোনাম বা তথ্য দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter status */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            প্রদর্শিত হচ্ছে: <strong className="text-white">{filteredLogs.length}</strong> টি কার্যকলাপ
            {selectedReporter !== 'all' && (
              <span className="ml-2 text-blue-400">({selectedReporter}-এর জন্য)</span>
            )}
          </span>
          {(selectedReporter !== 'all' || selectedActionType !== 'all' || searchQuery) && (
            <button
              onClick={() => { setSelectedReporter('all'); setSelectedActionType('all'); setSearchQuery(''); }}
              className="text-amber-400 hover:underline"
            >
              সব ফিল্টার রিসেট
            </button>
          )}
        </div>

        {/* Logs List / Cards */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs">কোনো অ্যাক্টিভিটি পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার দেখুন।</p>
            </div>
          ) : (
            filteredLogs.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {item.reporterEmail ? item.reporterEmail[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {item.reporterEmail}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getActionBadgeColor(item.actionType)}`}>
                          {item.action}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {item.timestamp}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" /> {item.date}
                        </span>
                      </p>
                    </div>
                  </div>

                  {item.headline && onSelectHeadline && (
                    <button
                      onClick={() => onSelectHeadline(item.headline!)}
                      className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition flex items-center gap-1"
                      title="এই হেডলাইনটি ফটোকার্ডে লোড করুন"
                    >
                      <Eye className="w-3 h-3" /> হেডলাইন লোড
                    </button>
                  )}
                </div>

                {/* Headline preview if exists */}
                {item.headline && (
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-200">
                    <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">শিরোনাম / বার্তা:</span>
                    <p className="font-semibold leading-relaxed line-clamp-2">"{item.headline}"</p>
                  </div>
                )}

                {/* Additional details */}
                {item.details && (
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">বিবরণ:</strong> {item.details}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
