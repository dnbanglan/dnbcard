import React, { useState } from 'react';
import { 
  Download, 
  FileCode, 
  Archive, 
  Server, 
  Globe, 
  CheckCircle2, 
  Copy, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  FolderArchive
} from 'lucide-react';

interface DownloadPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadPackageModal: React.FC<DownloadPackageModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'cpanel' | 'subdomain' | 'single'>('cpanel');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDownloadFile = async (filePath: string, fileName: string, type: 'zip' | 'html') => {
    if (type === 'zip') setDownloadingZip(true);
    else setDownloadingHtml(true);

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('File download failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.setAttribute('download', fileName);
      document.body.appendChild(tempLink);
      tempLink.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(tempLink);
      }, 500);
    } catch (err) {
      // Fallback: direct window location
      window.location.href = filePath;
    } finally {
      if (type === 'zip') setDownloadingZip(false);
      else setDownloadingHtml(false);
    }
  };

  const getFullUrl = (path: string) => {
    try {
      return `${window.location.origin}${path}`;
    } catch {
      return path;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ডাউনলোড ফাইল ও লাইভ হোস্টিং প্যাকেজ
              </h3>
              <p className="text-xs text-slate-400">একক .HTML ফাইল এবং কাস্টম ডোমেইন হোস্টিং .ZIP প্যাকেজ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* 2 Primary Download Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: Single Standalone HTML */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <FileCode className="w-6 h-6" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                    একক .HTML ফাইল
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">১। সম্পূর্ণ একক .HTML ফাইল</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  সবকিছু (ডিজাইন, ফটোকার্ড ইঞ্জিন, লগইন সিস্টেম, অডিট ট্র্যাকার ও এড ম্যানেজার) মাত্র একটি ফাইলের ভেতর সমন্বিত। ডাবল ক্লিক করলেই যেকোনো ব্রাউজারে চলবে।
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleDownloadFile('/dnbangla_single_file.html', 'dnbangla_single_file.html', 'html')}
                    disabled={downloadingHtml}
                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className={`w-4 h-4 ${downloadingHtml ? 'animate-bounce' : ''}`} />
                    {downloadingHtml ? 'ডাউনলোড হচ্ছে...' : 'ডাউনলোড .HTML'}
                  </button>
                  <a
                    href="/dnbangla_single_file.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white border border-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="নতুন ব্রাউজার ট্যাবে সরাসরি প্রিভিউ দেখুন"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> ওপেন
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(getFullUrl('/dnbangla_single_file.html'), 'html-link')}
                  className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-blue-400" />
                  <span>{copiedText === 'html-link' ? 'লিঙ্ক কপি হয়েছে!' : 'সরাসরি .HTML লিঙ্ক কপি করুন'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Custom Domain Hosting ZIP */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                    <Archive className="w-6 h-6" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    কাস্টম ডোমেইন রেডি
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">২। হোস্টিং লাইভ প্যাকেজ (.ZIP)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  সিপ্যানেল (cPanel), Hostinger, Namecheap বা যেকোনো হোস্টিংয়ের <code>public_html</code> এ আপলোড করে Extract করলেই সঙ্গে সঙ্গে লাইভ হয়ে যাবে।
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleDownloadFile('/dnbangla_portal_live.zip', 'dnbangla_portal_live.zip', 'zip')}
                    disabled={downloadingZip}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FolderArchive className={`w-4 h-4 ${downloadingZip ? 'animate-bounce' : ''}`} />
                    {downloadingZip ? 'ডাউনলোড হচ্ছে...' : 'ডাউনলোড .ZIP'}
                  </button>
                  <a
                    href="/dnbangla_portal_live.zip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border border-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="ব্রাউজারে নতুন ট্যাবে খুলুন"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> নতুন ট্যাব
                  </a>
                </div>
                <button
                  onClick={() => copyToClipboard(getFullUrl('/dnbangla_portal_live.zip'), 'zip-link')}
                  className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-emerald-400" />
                  <span>{copiedText === 'zip-link' ? 'লিঙ্ক কপি হয়েছে!' : 'সরাসরি .ZIP লিঙ্ক কপি করুন'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Step-by-Step Hosting Deployment Guide */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                কীভাবে আপলোড করবেন ও লাইভ করবেন (ধাপে ধাপে দিক-নির্দেশনা)
              </h4>
            </div>

            {/* Guide Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs">
              <button
                onClick={() => setActiveGuideTab('cpanel')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeGuideTab === 'cpanel'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                সিপ্যানেল (cPanel) আপলোড
              </button>
              <button
                onClick={() => setActiveGuideTab('subdomain')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeGuideTab === 'subdomain'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                সাব-ডোমেইনে লাইভ (card.dnbangla.com.bd)
              </button>
              <button
                onClick={() => setActiveGuideTab('single')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeGuideTab === 'single'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                কম্পিউটারে লোকাল ব্যবহার
              </button>
            </div>

            {/* Guide Content */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
              {activeGuideTab === 'cpanel' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">১</span>
                    <p>আপনার হোস্টিংয়ের cPanel-এ লগইন করুন এবং <strong>File Manager</strong> (ফাইল ম্যানেজার) ওপেন করুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">২</span>
                    <p>ফাইল ম্যানেজারে ঢুকে <strong><code>public_html</code></strong> ফোল্ডারে প্রবেশ করুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">৩</span>
                    <p>ওপরের <strong>Upload</strong> বাটনে ক্লিক করে <strong><code>dnbangla_portal_live.zip</code></strong> ফাইলটি সিলেক্ট করে আপলোড করুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">৪</span>
                    <p>আপলোড শেষ হলে ফাইলটির ওপর রাইট-ক্লিক করে <strong>Extract</strong> এ চাপ দিন। ব্যস! <code>index.html</code> এবং <code>.htaccess</code> ফাইল সরাসরি এক্সট্র্যাক্ট হয়ে সাইট লাইভ হয়ে যাবে।</p>
                  </div>
                </div>
              )}

              {activeGuideTab === 'subdomain' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">১</span>
                    <p>cPanel-এর <strong>Domains / Subdomains</strong> অপশনে যান এবং একটি সাব-ডোমেন বানান (যেমন: <strong><code>card</code></strong> বা <strong><code>photocard</code></strong>)।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">২</span>
                    <p>ফাইল ম্যানেজারে গিয়ে সেই সাবডোমেনের ফোল্ডারে ঢুকুন (যেমন: <strong><code>public_html/card</code></strong>)।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">৩</span>
                    <p>সেখানে <strong><code>dnbangla_portal_live.zip</code></strong> আপলোড করে <strong>Extract</strong> করুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">৪</span>
                    <p>এবার ব্রাউজারে <code>https://card.dnbangla.com.bd</code> লিখলে সরাসরি আপনার ফটোকার্ড ইঞ্জিন চলে আসবে!</p>
                  </div>
                </div>
              )}

              {activeGuideTab === 'single' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">১</span>
                    <p><strong><code>dnbangla_single_file.html</code></strong> ফাইলটি ডাউনলোড করে আপনার কম্পিউটার বা পেনড্রাইভে রাখুন।</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">২</span>
                    <p>ফাইলটির ওপর ডাবল ক্লিক করলেই গুগল ক্রোম বা যেকোনো ব্রাউজারে পোর্টালটি চালু হয়ে যাবে। কোনো সার্ভার বা সফটওয়্যার ইনস্টল করার দরকার নেই।</p>
                  </div>
                </div>
              )}
            </div>

            {/* Login Credentials reminder */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-400">
              <span className="font-bold text-white block text-xs">লগইন ক্রেডেনশিয়াল তথ্য:</span>
              <p>• <strong>এডমিন:</strong> পাসওয়ার্ড: <span className="font-mono text-amber-300 font-bold">adminipdnb</span> (ইউজার: admin)</p>
              <p>• <strong>রিপোর্টার:</strong> পাসওয়ার্ড: <span className="font-mono text-blue-300 font-bold">posteditor</span> (ইউজার: যেকোনো বৈধ @gmail.com)</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
