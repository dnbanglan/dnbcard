import { AuditLogItem, AuthUser, ActionCategory } from '../types';

const AUDIT_STORAGE_KEY = 'dnbangla_reporter_audit_v2';

const initialDemoLogs: AuditLogItem[] = [
  {
    id: 'log-101',
    reporterEmail: 'tanvir.reporter@gmail.com',
    role: 'reporter',
    action: '১৯২০x১৯২০ ফটোকার্ড ডাউনলোড',
    actionType: 'download',
    headline: 'বাংলাদেশে নতুন ডিজিটাল অটোমেশন ও ফটোকার্ড সিস্টেম চালু হয়েছে',
    details: 'বিজ্ঞাপন: বিজ্ঞাপন ব্যানার 01 (NCEM), ফন্ট সাইজ: 80px',
    timestamp: '১০:৪৫:১২ AM',
    date: '২০২৬-১০-২৭'
  },
  {
    id: 'log-102',
    reporterEmail: 'farzana.news@gmail.com',
    role: 'reporter',
    action: 'ওয়ার্ডপ্রেস থেকে সংবাদ লোড',
    actionType: 'load_news',
    headline: 'ডিজিটাল রূপান্তরে সংবাদ মাধ্যমে আসছে বৈপ্লবিক পরিবর্তন',
    details: 'পোস্ট আইডি: #892, ক্যাটাগরি: প্রযুক্তি',
    timestamp: '১০:১৮:৩০ AM',
    date: '২০২৬-১০-২৭'
  },
  {
    id: 'log-103',
    reporterEmail: 'farzana.news@gmail.com',
    role: 'reporter',
    action: 'টেক্সট / টিগার ফটোকার্ড তৈরি ও ডাউনলোড',
    actionType: 'download',
    headline: 'আজ রাত ১০ টার মধ্যে সকল বিভাগীয় প্রধানদের জরুরি মিটিংয়ে উপস্থিত থাকার নির্দেশ',
    details: 'স্টাইল: DN Bangla Red Gradient, ফন্ট: 75px',
    timestamp: '০৯:৫২:০৫ AM',
    date: '২০২৬-১০-২৭'
  },
  {
    id: 'log-104',
    reporterEmail: 'shakil.dnb@gmail.com',
    role: 'reporter',
    action: 'শিডিউলার থেকে আবহাওয়া বার্তা ফটোকার্ডে লোড',
    actionType: 'schedule_send',
    headline: 'আজকের সকালের আবহাওয়া: সর্বনিম্ন তাপমাত্রা ২২° সে.',
    details: 'রুটিন: সকাল ০৬:৩০ টার আবহাওয়া বুলেটিন',
    timestamp: '০৮:৩৫:২২ AM',
    date: '২০২৬-১০-২৭'
  },
  {
    id: 'log-105',
    reporterEmail: 'tanvir.reporter@gmail.com',
    role: 'reporter',
    action: 'সিস্টেমে সফলভাবে লগইন',
    actionType: 'login',
    details: 'ডিভাইস: ব্রাউজার ক্লায়েন্ট (Asia/Dhaka)',
    timestamp: '০৮:০১:১০ AM',
    date: '২০২৬-১০-২৭'
  }
];

export function getAuditLogs(): AuditLogItem[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(initialDemoLogs));
      return initialDemoLogs;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse audit logs from localStorage', e);
  }
  return initialDemoLogs;
}

export function saveAuditLogs(logs: AuditLogItem[]): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 500))); // keep latest 500
  } catch (e) {
    console.warn('Failed to save audit logs to localStorage', e);
  }
}

export function logReporterAction(
  user: AuthUser,
  action: string,
  actionType: ActionCategory,
  headline?: string,
  details?: string,
  metadata?: Record<string, any>
): AuditLogItem {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toISOString().split('T')[0];

  const newLog: AuditLogItem = {
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    reporterEmail: user.email,
    role: user.role,
    action,
    actionType,
    headline,
    details,
    timestamp: timeStr,
    date: dateStr,
    metadata
  };

  const currentLogs = getAuditLogs();
  const updatedLogs = [newLog, ...currentLogs];
  saveAuditLogs(updatedLogs);

  // Dispatch custom event so UI updates live
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dnb_audit_log_added', { detail: newLog }));
  }

  return newLog;
}

export function clearAllAuditLogs(): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([]));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dnb_audit_log_cleared'));
    }
  } catch (e) {
    console.warn('Failed to clear audit logs', e);
  }
}

export function resetAuditLogsToSample(): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(initialDemoLogs));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dnb_audit_log_cleared'));
    }
  } catch (e) {
    console.warn('Failed to reset audit logs', e);
  }
}
