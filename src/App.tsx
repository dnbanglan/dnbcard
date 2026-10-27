import React, { useState, useEffect, useRef } from 'react';
import { AuthUser, AuditLogItem, AdBanner, StaffMember, WpPost, ActionCategory } from './types';
import { getStoredUser, saveStoredUser, clearStoredUser } from './services/auth';
import { getAuditLogs, logReporterAction } from './services/auditLogger';
import { LoginModal } from './components/LoginModal';
import { ReporterAuditView } from './components/ReporterAuditView';
import { DownloadPackageModal } from './components/DownloadPackageModal';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Type,
  Layers,
  CalendarDays,
  IdCard,
  Settings,
  Terminal,
  ShieldCheck,
  UserCheck,
  LogOut,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lock,
  Sun,
  CloudSun,
  Flame,
  Moon,
  Heart,
  Palette,
  Users
} from 'lucide-react';

const DEFAULT_ADS: AdBanner[] = [
  {
    id: 'ad-1',
    name: 'বিজ্ঞাপন ব্যানার 01',
    desc: 'নিউ ক্লাসিক ইভেন্ট ম্যানেজমেন্ট (NCEM) | 01945544242',
    image: '/ads/ad1.jpg',
    localFallback: '/ads/ad1.jpg'
  },
  {
    id: 'ad-2',
    name: 'বিজ্ঞাপন ব্যানার 02',
    desc: 'মুক্তি ক্লিনিক ও ডায়াগনস্টিক সেন্টার',
    image: '/ads/ad2.jpg',
    localFallback: '/ads/ad2.jpg'
  },
  {
    id: 'ad-3',
    name: 'বিজ্ঞাপন ব্যানার 03',
    desc: 'খাদিজা হুমায়রা রূপন',
    image: '/ads/ad3.jpg',
    localFallback: '/ads/ad3.jpg'
  },
  {
    id: 'ad-4',
    name: 'বিজ্ঞাপন ব্যানার 04',
    desc: 'মনির ডেন্টাল কেয়ার',
    image: '/ads/ad4.jpg',
    localFallback: '/ads/ad4.jpg'
  },
  {
    id: 'ad-5',
    name: 'বিজ্ঞাপন ব্যানার 05',
    desc: 'NCTTA একাডেমি',
    image: '/ads/ad5.jpg',
    localFallback: '/ads/ad5.jpg'
  }
];

const DEFAULT_STAFF: StaffMember[] = [
  { id: 'DN-2026-101', name: 'মোঃ তানভীর আহমেদ', designation: 'চিফ নিউজ এডিটর', dept: 'বার্তা বিভাগ', blood: 'O+', phone: '01711-223344', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
  { id: 'DN-2026-102', name: 'ফারজানা ইয়াসমিন', designation: 'সিনিয়র ইনভেস্টিগেটিভ রিপোর্টার', dept: 'বার্তা বিভাগ', blood: 'A+', phone: '01812-334455', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
  { id: 'DN-2026-103', name: 'রাকিবুল হাসান রনি', designation: 'হেড অব মাল্টিমিডিয়া ও ভিডিও', dept: 'মাল্টিমিডিয়া ও ভিডিও', blood: 'B+', phone: '01913-445566', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 'DN-2026-104', name: 'নুসরাত জাহান', designation: 'ডিজিটাল মিডিয়া ও সোশ্যাল লিড', dept: 'ডিজিটাল মিডিয়া ও সোশ্যাল', blood: 'AB+', phone: '01614-556677', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' }
];

export default function App() {
  // Current user state (null if not logged in; stays on login page)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredUser());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(getAuditLogs());

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    msg: '',
    type: 'success'
  });

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Helper to record reporter activity in audit trail
  const trackAction = (
    action: string,
    actionType: ActionCategory,
    headline?: string,
    details?: string
  ) => {
    if (!currentUser) return;
    const item = logReporterAction(currentUser, action, actionType, headline, details);
    setAuditLogs(prev => [item, ...prev]);
  };

  // Logout function available from both Admin and Reporter views
  const handleLogout = () => {
    try {
      if (currentUser) {
        logReporterAction(currentUser, 'সিস্টেম থেকে লগআউট করেছেন', 'other', undefined, `ইউজার: ${currentUser.email}`);
      }
    } catch (e) {
      console.warn('Logout logging warning:', e);
    }
    clearStoredUser();
    setCurrentUser(null);
    showToast('সফলভাবে লগআউট হয়েছে!');
  };

  // Ads state
  const [adBanners, setAdBanners] = useState<AdBanner[]>(() => {
    try {
      const saved = localStorage.getItem('dnbangla_permanent_ads_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_ADS;
  });
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [textAdIndex, setTextAdIndex] = useState(0);

  // WordPress Feed State
  const [wpPosts, setWpPosts] = useState<WpPost[]>([]);
  const [currentWpIndex, setCurrentWpIndex] = useState(0);
  const [wpFeedPage, setWpFeedPage] = useState(1);
  const [wpFeedTotalPages, setWpFeedTotalPages] = useState(1);
  const [wpFeedTotal, setWpFeedTotal] = useState(0);
  const [wpFeedDate, setWpFeedDate] = useState('');
  const [wpSyncInProgress, setWpSyncInProgress] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('—');

  // Staff State
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('dnbangla_staff_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_STAFF;
  });
  const [selectedStaffIndex, setSelectedStaffIndex] = useState(0);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [cardThemeColor, setCardThemeColor] = useState('#8b0000');
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    designation: '',
    dept: 'বার্তা বিভাগ',
    id: '',
    blood: 'O+',
    phone: '',
    validity: '৩১ ডিসেম্বর ২০২৬'
  });
  const [newStaffPhoto, setNewStaffPhoto] = useState<string>('');

  // 1920x1920 Canvas Controls
  const [topBgColor, setTopBgColor] = useState('#ffffff');
  const [topTextColor, setTopTextColor] = useState('#111111');
  const [bottomBgColor, setBottomBgColor] = useState('#840b0b');
  const [headlineTextColor, setHeadlineTextColor] = useState('#ffffff');
  const [isAutoDate, setIsAutoDate] = useState(true);
  const [dateValue, setDateValue] = useState(getDhakaDateInputValue());
  const [dateMode, setDateMode] = useState<'auto' | 'custom'>('auto');
  const [customDateText, setCustomDateText] = useState('২৭ অক্টোবর ২০২৬');
  const [dateFont, setDateFont] = useState<string>('Hind Siliguri');
  const [dateNumStyle, setDateNumStyle] = useState<'bn' | 'en' | 'raw'>('bn');
  const [commentBadge, setCommentBadge] = useState(true);
  const [commentText, setCommentText] = useState('বিস্তারিত কমেন্টে');
  const [headline, setHeadline] = useState('বাংলাদেশে নতুন ডিজিটাল অটোমেশন ও ফটোকার্ড সিস্টেম চালু হয়েছে');
  const [fontSize, setFontSize] = useState(80);
  const [margin, setMargin] = useState(120);
  const [socialBar, setSocialBar] = useState(true);
  const [footerBgColor, setFooterBgColor] = useState('#1e293b');
  const [websiteUrl, setWebsiteUrl] = useState('DNBangla.com.bd');
  const [customCommentUrl, setCustomCommentUrl] = useState('/dnbanglaN');
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'facebook.com/dnbanglan',
    x: 'x.com/dnbanglan',
    threads: 'Threads.com/dnbanglan',
    instagram: 'instagram.com/dnbanglan',
    youtube: 'youtube.com/@dnbanglan',
    linkedin: 'linkedin.com/in/dnbanglan/'
  });
  const [uploadedBgImg, setUploadedBgImg] = useState<HTMLImageElement | null>(null);

  // Text / Trigger Card Controls
  const [ttBgStyle, setTtBgStyle] = useState('gradient-red');
  const [ttCustomColor, setTtCustomColor] = useState('#25406b');
  const [ttCategory, setTtCategory] = useState('⚠️ বিশেষ ঘোষণা ও ব্রেকিং নিউজ');
  const [ttContent, setTtContent] = useState('আজ রাত ১০ টার মধ্যে সকল বিভাগীয় প্রধানদের জরুরি মিটিংয়ে উপস্থিত থাকার নির্দেশ দেওয়া হলো।');
  const [ttFontSize, setTtFontSize] = useState(75);
  const [ttMargin, setTtMargin] = useState(225);

  // System Logs
  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] 1920x1920 PhotoCard Engine initialized successfully.`,
    `[${new Date().toLocaleTimeString()}] Initialized system portal.`
  ]);

  // Canvas Refs
  const photocardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textTriggerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const staffCardCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preloaded ad and staff images
  const adImagesRef = useRef<Record<number, HTMLImageElement>>({});
  const staffImagesRef = useRef<Record<string, HTMLImageElement>>({});

  function addSystemLog(msg: string) {
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 100)]);
  }

  // Preload ads with robust multi-stage fallback
  useEffect(() => {
    adBanners.forEach((ad, idx) => {
      const loadAd = (url: string, isFallback: boolean = false) => {
        if (!url) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          adImagesRef.current[idx] = img;
          drawPhotocardCanvas();
          drawTextTriggerCanvas();
        };
        img.onerror = () => {
          if (!isFallback && ad.localFallback && ad.localFallback !== url) {
            loadAd(ad.localFallback, true);
          } else if (!isFallback && ad.image && ad.image !== url) {
            loadAd(ad.image, true);
          } else {
            // Also try without crossOrigin
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
              adImagesRef.current[idx] = fallbackImg;
              drawPhotocardCanvas();
              drawTextTriggerCanvas();
            };
            fallbackImg.src = url;
          }
        };
        img.src = url;
      };

      loadAd(ad.image || ad.localFallback || `/ads/ad${(idx % 5) + 1}.jpg`);
    });
  }, [adBanners]);

  // Preload staff photos
  useEffect(() => {
    staffList.forEach(st => {
      if (st.photo) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          staffImagesRef.current[st.id] = img;
          drawStaffCard();
        };
        img.onerror = () => {
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            staffImagesRef.current[st.id] = fallbackImg;
            drawStaffCard();
          };
          fallbackImg.src = st.photo;
        };
        img.src = st.photo;
      }
    });
  }, [staffList]);

  // Automatic redraw whenever tab switches so canvas renders immediately upon arrival
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'photocard') {
        drawPhotocardCanvas();
      } else if (activeTab === 'texttrigger' || activeTab === 'text-trigger') {
        drawTextTriggerCanvas();
      } else if (activeTab === 'staff' || activeTab === 'staff-id') {
        drawStaffCard();
      }
    }, 40);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Synchronize photocard canvas draws
  useEffect(() => {
    drawPhotocardCanvas();
  }, [
    activeTab,
    topBgColor,
    topTextColor,
    bottomBgColor,
    headlineTextColor,
    dateValue,
    dateMode,
    customDateText,
    dateFont,
    dateNumStyle,
    commentBadge,
    commentText,
    headline,
    fontSize,
    margin,
    socialBar,
    footerBgColor,
    websiteUrl,
    socialLinks,
    currentAdIndex,
    uploadedBgImg
  ]);

  useEffect(() => {
    drawTextTriggerCanvas();
  }, [
    activeTab,
    ttBgStyle,
    ttCustomColor,
    ttCategory,
    ttContent,
    ttFontSize,
    ttMargin,
    textAdIndex,
    websiteUrl,
    socialLinks,
    footerBgColor
  ]);

  useEffect(() => {
    drawStaffCard();
  }, [activeTab, staffList, selectedStaffIndex, cardSide, cardThemeColor]);

  // Initial WP feed fetch
  useEffect(() => {
    fetchWordPressFeed(1, false);
  }, []);

  function getDhakaDateInputValue(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Dhaka'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function formatToBengaliDate(dateValue: string | Date) {
    if (!dateValue) return '';
    let date: Date;
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const [year, month, day] = dateValue.split('-').map(Number);
      date = new Date(Date.UTC(year, month - 1, day, 6));
    } else {
      date = new Date(dateValue);
    }
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Dhaka'
    }).formatToParts(date)
      .filter(part => ['day', 'month', 'year'].includes(part.type))
      .map(part => part.value)
      .join(' ');
  }

  function toBengaliNumber(num: number | string) {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, w => bnDigits[+w]);
  }

  function toEnglishNumber(str: string) {
    const bnToEn: Record<string, string> = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
    return String(str).replace(/[০-৯]/g, w => bnToEn[w] || w);
  }

  function getDisplayDate(): string {
    if (dateMode === 'custom') {
      const text = customDateText.trim() || '২৭ অক্টোবর ২০২৬';
      if (dateNumStyle === 'bn') return toBengaliNumber(text);
      if (dateNumStyle === 'en') return toEnglishNumber(text);
      return text;
    }
    const autoDate = formatToBengaliDate(dateValue);
    if (dateNumStyle === 'en') return toEnglishNumber(autoDate);
    return autoDate;
  }

  // Draw 1920x1920 Main Canvas
  function drawPhotocardCanvas() {
    const canvas = photocardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = 1920;
    const height = 1920;

    ctx.clearRect(0, 0, width, height);

    // 1. TOP HEADER (0px to 80px)
    ctx.fillStyle = topBgColor;
    ctx.fillRect(0, 0, width, 80);

    ctx.fillStyle = '#df202c';
    ctx.font = '900 48px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('ডিএন', 60, 42);
    ctx.fillStyle = '#16763d';
    ctx.fillText('বাংলা', 175, 42);

    // Date rendering with selected font, bold digits, and vertical alignment
    const displayDate = getDisplayDate();
    ctx.fillStyle = topTextColor;
    const fontStr = dateFont === 'SutonnyMJ'
      ? 'bold 38px "SutonnyMJ", "Hind Siliguri", "Noto Sans Bengali", sans-serif'
      : `bold 38px "${dateFont}", "Hind Siliguri", "Noto Sans Bengali", sans-serif`;
    ctx.font = fontStr;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayDate, width - 60, 42);

    // 2. FEATURE PHOTO AREA (80px to 1165px = 1085px)
    const photoY = 80;
    const photoH = 1085;
    if (uploadedBgImg) {
      drawImageCover(ctx, uploadedBgImg, 0, photoY, width, photoH);
    } else {
      const grad = ctx.createLinearGradient(0, photoY, 0, photoY + photoH);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, photoY, width, photoH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 50px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('সংবাদের ফিচার ছবি (1920x1080px)', width / 2, photoY + (photoH / 2));
    }

    // "বিস্তারিত কমেন্টে" BADGE (1090px to 1165px = 75px)
    if (commentBadge) {
      ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
      const textWidth = ctx.measureText(commentText).width;
      const badgeH = 55;
      const badgeW = textWidth + 70;
      const badgeX = (width - badgeW) / 2;
      const badgeY = 1090 + (75 - badgeH) / 2;
      const cornerRadius = badgeH / 2;

      ctx.beginPath();
      ctx.fillStyle = '#059669';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, cornerRadius);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(commentText, width / 2, badgeY + 38);
    }

    // 3. HEADLINE AREA (1165px to 1563px = 398px)
    const headlineY = 1165;
    const headlineH = 398;
    ctx.fillStyle = bottomBgColor;
    ctx.fillRect(0, headlineY, width, headlineH);

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, headlineY, width, headlineH);
    ctx.clip();

    let curFontSize = fontSize;
    const maxWidth = width - (margin * 2);
    ctx.fillStyle = headlineTextColor;
    ctx.textAlign = 'center';
    ctx.font = `bold ${curFontSize}px "Hind Siliguri", sans-serif`;

    let lines = wrapText(ctx, headline, maxWidth);
    while ((lines.length * (curFontSize * 1.35)) > (headlineH - 20) && curFontSize > 18) {
      curFontSize -= 2;
      ctx.font = `bold ${curFontSize}px "Hind Siliguri", sans-serif`;
      lines = wrapText(ctx, headline, maxWidth);
    }

    const lineGap = curFontSize * 1.35;
    const totalTextH = lines.length * lineGap;
    const startY = headlineY + (headlineH - totalTextH) / 2 + (curFontSize * 0.85);

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + (index * lineGap));
    });
    ctx.restore();

    // 4. SOCIAL & WEBSITE BAR (1563px to 1640px = 77px)
    const socialBarY = 1563;
    const socialBarH = 77;
    if (socialBar) {
      ctx.fillStyle = footerBgColor;
      ctx.fillRect(0, socialBarY, width, socialBarH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, socialBarY, width, socialBarH);

      if (websiteUrl.trim()) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 30px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(websiteUrl, 64, socialBarY + socialBarH / 2, 500);
      }

      const activeSocials = [
        { platform: 'facebook', url: socialLinks.facebook },
        { platform: 'x', url: socialLinks.x },
        { platform: 'threads', url: socialLinks.threads },
        { platform: 'instagram', url: socialLinks.instagram },
        { platform: 'youtube', url: socialLinks.youtube },
        { platform: 'linkedin', url: socialLinks.linkedin }
      ].filter(s => s.url.trim());

      const iconSize = 52;
      const iconGap = 42;
      const groupWidth = activeSocials.length * iconSize + Math.max(0, activeSocials.length - 1) * iconGap;
      const iconAreaStart = websiteUrl.trim() ? 610 : 0;
      const iconAreaEnd = width - 55;
      const firstIconX = iconAreaStart + (iconAreaEnd - iconAreaStart - groupWidth) / 2 + iconSize / 2;

      activeSocials.forEach((social, index) => {
        drawSocialIcon(
          ctx,
          social.platform,
          firstIconX + index * (iconSize + iconGap),
          socialBarY + socialBarH / 2,
          iconSize
        );
      });
    }

    // 5. ADVERTISEMENT BANNER (1640px to 1920px = 280px)
    const adY = 1640;
    const adH = 280;
    const adImg = adImagesRef.current[currentAdIndex];
    if (adImg && adImg.complete && adImg.naturalWidth > 0) {
      drawImageCover(ctx, adImg, 0, adY, width, adH);
    } else {
      const currentAd = adBanners[currentAdIndex] || DEFAULT_ADS[0];
      const grad = ctx.createLinearGradient(0, adY, width, adY + adH);
      grad.addColorStop(0, '#7f1d1d');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, adY, width, adH);

      // Gold top accent line
      ctx.fillStyle = '#eab308';
      ctx.fillRect(0, adY, width, 5);

      // Sponsor label badge
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('• বিজ্ঞাপন ও বিশেষ প্রচারণা •', width / 2, adY + 60);

      // Ad Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
      ctx.fillText(currentAd?.name || 'বিজ্ঞাপন ব্যানার', width / 2, adY + 125);

      // Ad Description / Contact
      ctx.fillStyle = '#fde047';
      ctx.font = '600 32px "Hind Siliguri", sans-serif';
      ctx.fillText(currentAd?.desc || 'বিজ্ঞাপনের জন্য যোগাযোগ করুন: 01945544242', width / 2, adY + 195);
    }
  }

  // Draw Text/Trigger PhotoCard Canvas
  function drawTextTriggerCanvas() {
    const canvas = textTriggerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = 1920;
    const height = 1920;
    const headerH = 85;
    const socialBarY = 1563;
    const socialBarH = 77;
    const adY = 1640;
    const adH = 280;

    ctx.clearRect(0, 0, width, height);

    // Background Palettes
    const palettes: Record<string, [string, string]> = {
      'gradient-red': ['#b20710', '#0f172a'],
      'gradient-blue': ['#1e293b', '#0b1224'],
      'gradient-maroon': ['#840b0b', '#241018'],
      'gradient-dark': ['#111827', '#030712']
    };
    const colors = ttBgStyle === 'custom' ? [ttCustomColor, '#0b0f19'] : (palettes[ttBgStyle] || palettes['gradient-red']);

    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, colors[0]);
    bgGrad.addColorStop(1, colors[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Header bar
    ctx.fillStyle = topBgColor;
    ctx.fillRect(0, 0, width, headerH);
    ctx.fillStyle = '#df202c';
    ctx.font = '900 48px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('ডিএন', 60, 58);
    ctx.fillStyle = '#16763d';
    ctx.fillText('বাংলা', 175, 58);
    ctx.fillStyle = topTextColor;
    ctx.font = '600 38px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatToBengaliDate(new Date()), width - 60, 55);

    // Category box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(100, 240, width - 200, 90);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 42px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ttCategory, width / 2, 300, width - 360);

    // Center Message
    const maxWidth = Math.max(1, width - (ttMargin * 2));
    const areaTop = 380;
    const areaBottom = socialBarY - 40;
    const areaHeight = areaBottom - areaTop;

    let curFontSize = ttFontSize;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = `bold ${curFontSize}px "Hind Siliguri", sans-serif`;
    let lines = wrapText(ctx, ttContent, maxWidth);

    while (lines.length * (curFontSize * 1.3) > areaHeight && curFontSize > 18) {
      curFontSize = Math.max(18, curFontSize - 2);
      ctx.font = `bold ${curFontSize}px "Hind Siliguri", sans-serif`;
      lines = wrapText(ctx, ttContent, maxWidth);
    }

    const lineHeight = curFontSize * 1.3;
    const totalH = lines.length * lineHeight;
    const firstBaseline = areaTop + (areaHeight - totalH) / 2 + curFontSize * 0.85;

    ctx.save();
    ctx.beginPath();
    ctx.rect(ttMargin, areaTop, maxWidth, areaHeight);
    ctx.clip();
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, firstBaseline + (index * lineHeight), maxWidth);
    });
    ctx.restore();

    // Social bar
    ctx.fillStyle = footerBgColor;
    ctx.fillRect(0, socialBarY, width, socialBarH);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, socialBarY, width, socialBarH);
    if (websiteUrl.trim()) {
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 30px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(websiteUrl, 64, socialBarY + socialBarH / 2, 500);
    }
    const activeSocials = [
      { platform: 'facebook', url: socialLinks.facebook },
      { platform: 'x', url: socialLinks.x },
      { platform: 'threads', url: socialLinks.threads },
      { platform: 'instagram', url: socialLinks.instagram },
      { platform: 'youtube', url: socialLinks.youtube },
      { platform: 'linkedin', url: socialLinks.linkedin }
    ].filter(s => s.url.trim());

    const iconSize = 52;
    const iconGap = 42;
    const groupWidth = activeSocials.length * iconSize + Math.max(0, activeSocials.length - 1) * iconGap;
    const iconAreaStart = websiteUrl.trim() ? 610 : 0;
    const iconAreaEnd = width - 55;
    const firstIconX = iconAreaStart + (iconAreaEnd - iconAreaStart - groupWidth) / 2 + iconSize / 2;

    activeSocials.forEach((social, index) => {
      drawSocialIcon(
        ctx,
        social.platform,
        firstIconX + index * (iconSize + iconGap),
        socialBarY + socialBarH / 2,
        iconSize
      );
    });

    // Ad Banner
    const safeTextAdIndex = adBanners.length ? textAdIndex % adBanners.length : 0;
    const adImg = adImagesRef.current[safeTextAdIndex];
    if (adImg && adImg.complete && adImg.naturalWidth > 0) {
      drawImageCover(ctx, adImg, 0, adY, width, adH);
    } else {
      const currentAd = adBanners[safeTextAdIndex] || DEFAULT_ADS[0];
      const grad = ctx.createLinearGradient(0, adY, width, adY + adH);
      grad.addColorStop(0, '#7f1d1d');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, adY, width, adH);

      // Gold top accent line
      ctx.fillStyle = '#eab308';
      ctx.fillRect(0, adY, width, 5);

      // Sponsor label badge
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('• বিজ্ঞাপন ও বিশেষ প্রচারণা •', width / 2, adY + 60);

      // Ad Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
      ctx.fillText(currentAd?.name || 'বিজ্ঞাপন ব্যানার', width / 2, adY + 125);

      // Ad Description / Contact
      ctx.fillStyle = '#fde047';
      ctx.font = '600 32px "Hind Siliguri", sans-serif';
      ctx.fillText(currentAd?.desc || 'বিজ্ঞাপনের জন্য যোগাযোগ করুন: 01945544242', width / 2, adY + 195);
    }
  }

  // Draw Staff ID Card Canvas
  function drawStaffCard() {
    const canvas = staffCardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = 600;
    const h = 920;
    const staff = staffList[selectedStaffIndex] || staffList[0];
    if (!staff) return;

    ctx.clearRect(0, 0, w, h);

    if (cardSide === 'front') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Top Banner
      ctx.fillStyle = cardThemeColor;
      ctx.fillRect(0, 0, w, 150);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 38px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ডিএন বাংলা', w / 2, 60);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
      ctx.fillText('DIGITAL PRESS ID CARD', w / 2, 92);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '500 13px "Hind Siliguri", sans-serif';
      ctx.fillText('জাতীয় গণমাধ্যম ও ডিজিটাল নেটওয়ার্ক', w / 2, 116);

      // Photo
      const photoY = 190;
      const photoR = 75;
      const centerX = w / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, photoY + photoR, photoR, 0, Math.PI * 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.strokeStyle = cardThemeColor;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.clip();

      const pImg = staffImagesRef.current[staff.id];
      if (pImg && pImg.complete) {
        ctx.drawImage(pImg, centerX - photoR, photoY, photoR * 2, photoR * 2);
      } else {
        ctx.fillStyle = '#334155';
        ctx.fillRect(centerX - photoR, photoY, photoR * 2, photoR * 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
        ctx.fillText('PHOTO', centerX, photoY + photoR + 8);
      }
      ctx.restore();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(staff.name, centerX, 385);

      ctx.fillStyle = cardThemeColor;
      ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
      ctx.fillText(staff.designation, centerX, 418);

      ctx.fillStyle = '#64748b';
      ctx.font = '600 16px "Hind Siliguri", sans-serif';
      ctx.fillText(staff.dept, centerX, 444);

      // Information Box
      const boxY = 485;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(50, boxY, w - 100, 195);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(50, boxY, w - 100, 195);

      const rows = [
        { label: 'আইডি নম্বর:', val: staff.id, color: '#0f172a', mono: true },
        { label: 'রক্তের গ্রুপ:', val: staff.blood, color: '#dc2626', bold: true },
        { label: 'মোবাইল:', val: staff.phone, color: '#0f172a' },
        { label: 'মেয়াদ:', val: staff.validity, color: '#047857' }
      ];

      rows.forEach((r, idx) => {
        const rowY = boxY + 36 + (idx * 42);
        ctx.font = '600 16px "Hind Siliguri", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'left';
        ctx.fillText(r.label, 80, rowY);

        ctx.font = (r.bold ? 'bold ' : '600 ') + '17px ' + (r.mono ? 'monospace' : '"Hind Siliguri", sans-serif');
        ctx.fillStyle = r.color;
        ctx.textAlign = 'right';
        ctx.fillText(r.val, w - 80, rowY);
      });

      // Signature & Stamp
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w - 240, 755);
      ctx.lineTo(w - 70, 755);
      ctx.stroke();

      ctx.font = 'italic 18px cursive, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText('Tanveer Ahmed', w - 155, 742);

      ctx.font = '600 13px "Hind Siliguri", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('কর্তৃপক্ষের স্বাক্ষর', w - 155, 775);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(75, 710, 80, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('VERIFIED', 115, 755);

      // Footer
      ctx.fillStyle = cardThemeColor;
      ctx.fillRect(0, h - 35, w, 35);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 13px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WWW.DNBANGLA.COM.BD • ২৪ ঘণ্টা সংবাদ ও তথ্য', w / 2, h - 12);

    } else {
      // BACK SIDE
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = cardThemeColor;
      ctx.fillRect(0, 0, w, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ডিএন বাংলা মিডিয়া নেটওয়ার্ক লিমিটেড', w / 2, 38);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('জরুরি নির্দেশনা ও আইনগত তথ্যাবলী', w / 2, 110);

      const terms = [
        '১. এই কার্ডটি ডিএন বাংলা সংবাদ সংস্থার সরকারি সম্পত্তি।',
        '২. সংবাদ সংগ্রহের উদ্দেশ্যে সংশ্লিষ্ট সকল আইনশৃঙ্খলা বাহিনী ও',
        '   কর্তৃপক্ষকে প্রয়োজনীয় সহযোগিতা প্রদানের অনুরোধ জানানো যাচ্ছে।',
        '৩. কার্ডটি অপব্যবহার বা হস্তান্তর দণ্ডনীয় অপরাধ।',
        '৪. কার্ডটি হারিয়ে গেলে নিকটস্থ থানায় জিডি করুন ও অফিসে জানান।'
      ];

      ctx.font = '15px "Hind Siliguri", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'left';
      terms.forEach((t, i) => {
        ctx.fillText(t, 60, 160 + (i * 32));
      });

      // Office box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(50, 360, w - 100, 220);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(50, 360, w - 100, 220);

      ctx.fillStyle = cardThemeColor;
      ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('অফিস ও স্টুডিও ঠিকানা:', w / 2, 400);

      ctx.fillStyle = '#334155';
      ctx.font = '14px "Hind Siliguri", sans-serif';
      ctx.fillText('ডিএন বাংলা টাওয়ার, প্লট-৭, কাওরান বাজার, ঢাকা-১২১৫', w / 2, 435);
      ctx.fillText('ফোন: +৮৮০-২-৯৯৮৮৭৭৬৬ | ইমেইল: info@dnbangla.com.bd', w / 2, 465);
      ctx.fillText('জরুরি হটলাইন: ০১৯৪৫৫৪৪২৪২', w / 2, 495);
      ctx.fillText('ওয়েবসাইট: www.dnbangla.com.bd', w / 2, 525);

      // Barcode
      const bcY = 660;
      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < 65; i++) {
        const bw = (i % 3 === 0 ? 5 : (i % 2 === 0 ? 3 : 2));
        const bx = 110 + (i * 6);
        ctx.fillRect(bx, bcY, bw, 60);
      }
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('*' + staff.id + '-DNBANGLA*', w / 2, bcY + 85);

      ctx.fillStyle = cardThemeColor;
      ctx.fillRect(0, h - 45, w, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 13px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('কার্ডটি পাওয়া গেলে নিকটস্থ ডাকবাক্সে বা ঠিকানায় পাঠিয়ে দিন।', w / 2, h - 18);
    }
  }

  function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
    if (!img || !img.width || !img.height) return;
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function drawSocialIcon(ctx: CanvasRenderingContext2D, platform: string, cx: number, cy: number, size: number) {
    const radius = size / 2;
    const colors: Record<string, string> = {
      facebook: '#1877F2',
      x: '#111111',
      threads: '#111111',
      instagram: '#D62976',
      youtube: '#FF0033',
      linkedin: '#0A66C2'
    };

    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = colors[platform] || '#333333';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (platform === 'facebook') {
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.fillText('f', 1, 2);
    } else if (platform === 'x') {
      ctx.beginPath();
      ctx.moveTo(-11, -11);
      ctx.lineTo(11, 11);
      ctx.moveTo(11, -11);
      ctx.lineTo(-11, 11);
      ctx.stroke();
    } else if (platform === 'threads') {
      ctx.font = 'bold 31px Arial, sans-serif';
      ctx.fillText('@', 0, 0);
    } else if (platform === 'instagram') {
      ctx.beginPath();
      ctx.roundRect(-15, -15, 30, 30, 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(9, -9, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (platform === 'youtube') {
      ctx.beginPath();
      ctx.roundRect(-17, -12, 34, 24, 7);
      ctx.fill();
      ctx.fillStyle = colors.youtube;
      ctx.beginPath();
      ctx.moveTo(-3, -7);
      ctx.lineTo(8, 0);
      ctx.lineTo(-3, 7);
      ctx.closePath();
      ctx.fill();
    } else if (platform === 'linkedin') {
      ctx.font = 'bold 26px Arial, sans-serif';
      ctx.fillText('in', 0, 0);
    }
    ctx.restore();
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const safeWidth = Math.max(1, maxWidth);
    const paragraphs = String(text ?? '').replace(/\r/g, '').split('\n');
    const lines: string[] = [];
    const segmenter = typeof Intl !== 'undefined' && (Intl as any).Segmenter
      ? new (Intl as any).Segmenter('bn', { granularity: 'grapheme' })
      : null;

    paragraphs.forEach(paragraph => {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push('');
        return;
      }
      let currentLine = '';
      words.forEach(word => {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(candidate).width <= safeWidth) {
          currentLine = candidate;
          return;
        }
        if (currentLine) lines.push(currentLine);
        if (ctx.measureText(word).width <= safeWidth) {
          currentLine = word;
          return;
        }
        const graphemes = segmenter
          ? Array.from(segmenter.segment(word), (item: any) => item.segment)
          : Array.from(word);
        let chunk = '';
        graphemes.forEach((grapheme: any) => {
          if (chunk && ctx.measureText(chunk + grapheme).width > safeWidth) {
            lines.push(chunk);
            chunk = grapheme;
          } else {
            chunk += grapheme;
          }
        });
        currentLine = chunk;
      });
      lines.push(currentLine);
    });

    return lines.length ? lines : [''];
  }

  // Download Canvas Helper
  function downloadCanvasAsPng(canvas: HTMLCanvasElement | null, filename: string, titleSummary: string) {
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(`${filename} ডাউনলোড সফল হয়েছে!`);
      // Log audit action
      trackAction(
        'ফটোকার্ড ডাউনলোড',
        'download',
        titleSummary,
        `রেজোলিউশন: 1920x1920 PX, ফাইল: ${filename}`
      );
      addSystemLog(`User ${currentUser?.email || 'user'} downloaded ${filename}`);
    } catch (e) {
      console.warn('Canvas download error', e);
      showToast('ডাউনলোড সম্পন্ন করা যায়নি।', 'error');
    }
  }

  // Handle Feature Photo Upload
  function handleFeaturePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('একটি বৈধ ছবি ফাইল নির্বাচন করুন।', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedBgImg(img);
        showToast('সংবাদের ফিচার ছবি সফলভাবে লোড হয়েছে।');
        trackAction('ফিচার ছবি আপলোড', 'edit', headline, `ছবি সাইজ: ${(file.size / 1024).toFixed(1)} KB`);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // WordPress Feed Fetch
  async function fetchWordPressFeed(page = 1, isManual = true) {
    if (wpSyncInProgress) return;
    setWpSyncInProgress(true);
    try {
      const endpoint = new URL('https://www.dnbangla.com.bd/wp-json/wp/v2/posts');
      endpoint.searchParams.set('_embed', 'true');
      endpoint.searchParams.set('per_page', '6');
      endpoint.searchParams.set('page', String(page));
      endpoint.searchParams.set('orderby', 'date');
      endpoint.searchParams.set('order', 'desc');
      if (wpFeedDate) {
        endpoint.searchParams.set('after', `${wpFeedDate}T00:00:00+06:00`);
        endpoint.searchParams.set('before', `${wpFeedDate}T23:59:59+06:00`);
      }

      const res = await fetch(endpoint.toString(), { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const total = Number(res.headers.get('X-WP-Total') || 0);
      const totalPages = Number(res.headers.get('X-WP-TotalPages') || 1);

      const posts: WpPost[] = data.map((p: any) => ({
        id: p.id,
        cleanTitle: decodeHtmlEntities(p.title?.rendered || ''),
        featuredImage: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        category: p._embedded?.['wp:term']?.[0]?.[0]?.name || 'সংবাদ',
        date: p.date || '',
        bengaliDate: formatToBengaliDate(p.date),
        link: p.link || ''
      }));

      setWpPosts(posts);
      setWpFeedPage(page);
      setWpFeedTotal(total);
      setWpFeedTotalPages(totalPages);
      setLastSyncTime(new Date().toLocaleTimeString('bn-BD'));
      addSystemLog(`WordPress Feed synced (${posts.length} posts).`);

      if (isManual) {
        showToast(`WordPress থেকে ${toBengaliNumber(total)}টি লাইভ সংবাদ সিঙ্ক হয়েছে!`);
        trackAction('ওয়ার্ডপ্রেস লাইভ সিঙ্ক', 'load_news', undefined, `পৃষ্ঠা: ${page}, মোট পোস্ট: ${total}`);
      }
    } catch (e) {
      console.warn('WP Feed fetch error', e);
      if (isManual) showToast('WordPress সংবাদ আনা যায়নি। নেটওয়ার্ক চেক করুন।', 'error');
    } finally {
      setWpSyncInProgress(false);
    }
  }

  function decodeHtmlEntities(str: string): string {
    if (!str) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      .replace(/&#8216;/g, '‘')
      .replace(/&#8217;/g, '’')
      .replace(/&#8220;/g, '“')
      .replace(/&#8221;/g, '”')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ');
  }

  // Load a WordPress Post into Main PhotoCard
  function loadWpPostIntoPhotocard(post: WpPost) {
    setHeadline(post.cleanTitle);
    if (post.date) setDateValue(getDhakaDateInputValue(new Date(post.date)));
    if (post.featuredImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setUploadedBgImg(img);
        drawPhotocardCanvas();
      };
      img.onerror = () => {
        const fallback = new Image();
        fallback.onload = () => {
          setUploadedBgImg(fallback);
          drawPhotocardCanvas();
        };
        fallback.src = post.featuredImage;
      };
      img.src = post.featuredImage;
    }
    setActiveTab('photocard');
    showToast(`ফটোকার্ডে লোড হয়েছে: "${post.cleanTitle.substring(0, 30)}..."`);
    trackAction('সংবাদ ফটোকার্ডে লোড', 'load_news', post.cleanTitle, `ক্যাটাগরি: ${post.category}, পোস্ট ID: #${post.id}`);
  }

  // Load a WordPress Post into Text Trigger Card
  function loadWpPostIntoTextTrigger(post: WpPost) {
    setTtCategory(`⚠️ ব্রেকিং নিউজ • ${post.category}`);
    setTtContent(post.cleanTitle);
    setActiveTab('texttrigger');
    showToast(`টিগার কার্ডে লোড হয়েছে: "${post.cleanTitle.substring(0, 30)}..."`);
    trackAction('সংবাদ টিগার কার্ডে লোড', 'load_news', post.cleanTitle, `ক্যাটাগরি: ${post.category}`);
  }

  // If not logged in, remain strictly on the Login Page!
  if (!currentUser) {
    return (
      <LoginModal
        currentUser={null}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`স্বাগতম, ${user.name || user.email}! (${user.role === 'admin' ? 'এডমিন' : 'রিপোর্টার'})`);
        }}
      />
    );
  }

  // Check role access
  const isReporter = currentUser.role === 'reporter';
  const isAdmin = currentUser.role === 'admin';

  // Permission Guard Helper for non-reporters
  const handleAdminOnlyAction = (actionName: string, execute: () => void) => {
    if (isReporter) {
      showToast(`🔒 ${actionName} শুধুমাত্র এডমিনের জন্য সংরক্ষিত। রিপোর্টার কেবল দেখতে পারবেন।`, 'info');
      return;
    }
    execute();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-red-600 selection:text-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 animate-bounce-short">
          <div className={`p-3.5 rounded-xl border text-xs shadow-2xl flex items-center gap-3 backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/50 text-red-200'
              : toast.type === 'info'
              ? 'bg-blue-950/90 border-blue-500/50 text-blue-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}>
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span className="font-medium">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand Logo & Current Role Status */}
          <div className="p-4 border-b border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 text-white font-bold rounded-lg px-2.5 py-1 text-lg shadow-lg shadow-red-900/40">
                  DN
                </div>
                <div>
                  <h1 className="font-bold text-base tracking-wide text-white">ডিএন বাংলা</h1>
                  <p className="text-[10px] text-slate-400">1920x1920 PhotoCard Engine</p>
                </div>
              </div>
            </div>

            {/* User identity capsule with Logout trigger */}
            <div
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 cursor-pointer transition flex items-center justify-between group"
              title="লগআউট করতে ক্লিক করুন"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isAdmin ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {isAdmin ? 'A' : 'R'}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">
                    {currentUser.name || currentUser.email}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate">
                    {isAdmin ? '👑 সুপার এডমিন' : `👤 রিপোর্টার (${currentUser.email})`}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-red-400 group-hover:text-red-300 font-semibold shrink-0 flex items-center gap-1">
                <LogOut className="w-3 h-3" /> লগআউট
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                activeTab === 'overview'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>ওভারভিউ ড্যাশবোর্ড</span>
            </button>

            <button
              onClick={() => setActiveTab('photocard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                activeTab === 'photocard'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>ফটোকার্ড জেনারেটর</span>
            </button>

            <button
              onClick={() => setActiveTab('texttrigger')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                activeTab === 'texttrigger'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Type className="w-4 h-4 shrink-0" />
              <span>টেক্সট / টিগার ফটোকার্ড</span>
            </button>

            <button
              onClick={() => setActiveTab('admanager')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left ${
                activeTab === 'admanager'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 shrink-0" />
                <span>লোকাল এড ম্যানেজার</span>
              </div>
              {isReporter && <span title="রিপোর্টার ভিউ মোড"><Lock className="w-3.5 h-3.5 text-slate-500" /></span>}
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left ${
                activeTab === 'schedule'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span>দৈনিক অটো শিডিউলার</span>
              </div>
              {isReporter && <span title="রিপোর্টার ভিউ মোড"><Lock className="w-3.5 h-3.5 text-slate-500" /></span>}
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left ${
                activeTab === 'staff'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <IdCard className="w-4 h-4 shrink-0" />
                <span>কর্মী আইডি কার্ড</span>
              </div>
              {isReporter && <span title="রিপোর্টার ভিউ মোড"><Lock className="w-3.5 h-3.5 text-slate-500" /></span>}
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left ${
                activeTab === 'integrations'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 shrink-0" />
                <span>ওয়ার্ডপ্রেস ও সোশ্যাল API</span>
              </div>
              {isReporter && <span title="রিপোর্টার ভিউ মোড"><Lock className="w-3.5 h-3.5 text-slate-500" /></span>}
            </button>

            {/* ADMIN-EXCLUSIVE AUDIT TRACKER TAB */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('audit')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left border ${
                  activeTab === 'audit'
                    ? 'bg-amber-600 text-white font-bold border-amber-500'
                    : 'text-amber-300 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">রিপোর্টার অডিট ট্র্যাকার</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                  {auditLogs.length}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                activeTab === 'logs'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>লাইভ সিস্টেম লগস</span>
            </button>
          </nav>
        </div>

        {/* Footer info & Logout in sidebar */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            title="একক .HTML ফাইল ও হোস্টিংয়ের জন্য .ZIP প্যাকেজ ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>ডাউনলোড প্যাকেজ (.ZIP / .HTML)</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            title="সিস্টেম থেকে লগআউট করুন"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>লগআউট করুন</span>
          </button>
          <div className="flex items-center justify-between text-slate-400 text-[10px] pt-0.5">
            <span>সিস্টেম: v3.5 Multi-Role</span>
            <span className="text-slate-500">ডিএন বাংলা</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              অটোমেশন কন্ট্রোল সেন্টার
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> লাইভ ইঞ্জিন সক্রিয়
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Banner Indicator */}
            <div className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 hidden lg:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>সক্রিয় ব্যানার: <strong className="text-amber-400">{adBanners[currentAdIndex]?.name || 'ব্যানার'}</strong></span>
            </div>

            {/* Download Portal Package (.ZIP / .HTML) Button */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition cursor-pointer"
              title="একক .HTML ফাইল ও হোস্টিংয়ের জন্য .ZIP প্যাকেজ ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ডাউনলোড প্যাকেজ (.ZIP/.HTML)</span>
              <span className="sm:hidden">প্যাকেজ</span>
            </button>

            {/* Sync WordPress Button */}
            <button
              onClick={() => fetchWordPressFeed(wpFeedPage, true)}
              disabled={wpSyncInProgress}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${wpSyncInProgress ? 'animate-spin' : ''}`} />
              <span>ওয়ার্ডপ্রেস সিঙ্ক</span>
            </button>

            {/* Current user status indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> : <UserCheck className="w-3.5 h-3.5 text-blue-400" />}
              <span className="font-semibold text-white">{currentUser.name || currentUser.email}</span>
              <span className="text-[10px] text-slate-400">({isAdmin ? 'এডমিন' : 'রিপোর্টার'})</span>
            </div>

            {/* Dedicated Logout Button (Top Bar) */}
            <button
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/40 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
              title="সিস্টেম থেকে লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>লগআউট</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 md:p-6 space-y-6">

          {/* Role Access Notice Banner */}
          {isReporter ? (
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">রিপোর্টার মোড সক্রিয় ({currentUser.email})</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    আপনি ড্যাশবোর্ড, ১৯২০x১৯২০ ফটোকার্ড ও টেক্সট ফটোকার্ডে পূর্ণ কাজ করতে পারবেন। অন্য সব ট্যাব ভিউ-অনলি মোডে রয়েছে এবং আপনার কার্যক্রম এডমিন অডিটে সংরক্ষিত হচ্ছে।
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded text-[11px] font-semibold flex items-center gap-1.5"
                title="লগআউট করে অন্য অ্যাকাউন্টে প্রবেশ করুন"
              >
                <LogOut className="w-3 h-3 text-red-400" />
                <span>লগআউট / অ্যাকাউন্ট বদলান</span>
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">সুপার এডমিন মোড সক্রিয় ({currentUser.email})</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    আপনার সকল ফিচার, এড ব্যানার, কর্মী আইডি ও "রিপোর্টার অডিট ট্র্যাকার"-এ পূর্ণ নিয়ন্ত্রণ অধিকার রয়েছে।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('audit')}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold shadow flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" /> রিপোর্টার অডিট দেখুন ({auditLogs.length})
              </button>
            </div>
          )}

          {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
          {activeTab === 'overview' && (
            <section className="space-y-6">
              {/* WordPress Status Capsule */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-2xl flex-shrink-0 border border-blue-500/30 font-bold">
                    WP
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-white text-sm md:text-base">WordPress লাইভ সংবাদ ফিড</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> dnbangla.com.bd সংযুক্ত
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ওয়েবসাইট থেকে সরাসরি সংবাদ নির্বাচন করে নিমেষেই ১৯২০x১৯২০ ফটোকার্ড বা টেক্সট ফটোকার্ড তৈরি করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
                    সর্বশেষ সিঙ্ক: {lastSyncTime}
                  </span>
                  <button
                    onClick={() => fetchWordPressFeed(wpFeedPage, true)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> এখনই রিফ্রেশ
                  </button>
                </div>
              </div>

              {/* 4 Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">মোট WordPress পোস্ট</p>
                    <h3 className="text-2xl font-bold text-blue-400 mt-1">{toBengaliNumber(wpFeedTotal || 100)} টি</h3>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl font-bold">
                    WP
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">লোকাল বিজ্ঞাপন ব্যানার</p>
                    <h3 className="text-2xl font-bold text-amber-400 mt-1">{toBengaliNumber(adBanners.length)} টি</h3>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">রেকর্ডকৃত রিপোর্টার অডিট</p>
                    <h3 className="text-2xl font-bold text-emerald-400 mt-1">{toBengaliNumber(auditLogs.length)} টি</h3>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">নিবন্ধিত কর্মী আইডি</p>
                    <h3 className="text-2xl font-bold text-purple-400 mt-1">{toBengaliNumber(staffList.length)} জন</h3>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <IdCard className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* WordPress Feed Grid */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-500" /> dnbangla.com.bd থেকে লাইভ সংবাদ
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      যেকোনো সংবাদের বাটনে ক্লিক করলেই স্বয়ংক্রিয়ভাবে ১৯২০x১৯২০ ফটোকার্ডে হেডলাইন ও ছবি লোড হবে।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={wpFeedPage <= 1}
                      onClick={() => fetchWordPressFeed(wpFeedPage - 1, true)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 border border-slate-700 rounded transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> পূর্ববর্তী ৬টি
                    </button>
                    <span className="text-xs text-slate-400 min-w-20 text-center font-mono">
                      পৃষ্ঠা {toBengaliNumber(wpFeedPage)} / {toBengaliNumber(wpFeedTotalPages)}
                    </span>
                    <button
                      disabled={wpFeedPage >= wpFeedTotalPages}
                      onClick={() => fetchWordPressFeed(wpFeedPage + 1, true)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 border border-slate-700 rounded transition flex items-center gap-1"
                    >
                      পরবর্তী ৬টি <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* News Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wpPosts.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                      <span>dnbangla.com.bd থেকে লাইভ সংবাদ আনা হচ্ছে...</span>
                    </div>
                  ) : (
                    wpPosts.map((post, idx) => (
                      <div
                        key={post.id || idx}
                        className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/50 transition flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="relative">
                            {post.featuredImage ? (
                              <img
                                src={post.featuredImage}
                                alt={post.cleanTitle}
                                className="w-full h-36 object-cover rounded-lg bg-slate-900"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-full h-36 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                                নো ফিচার ছবি
                              </div>
                            )}
                            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                              #{toBengaliNumber(idx + 1)} • {post.category}
                            </span>
                            <span className="absolute bottom-2 right-2 bg-black/80 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-sm">
                              {post.bengaliDate}
                            </span>
                          </div>

                          <h4
                            className="font-bold text-xs text-white line-clamp-2 leading-relaxed hover:text-blue-400 transition"
                            title={post.cleanTitle}
                          >
                            {post.cleanTitle}
                          </h4>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => loadWpPostIntoPhotocard(post)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold py-1.5 rounded transition flex items-center justify-center gap-1.5 shadow"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> ফটোকার্ডে লোড করুন
                          </button>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => loadWpPostIntoTextTrigger(post)}
                              className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-medium py-1 rounded transition flex items-center justify-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" /> টিগার কার্ড
                            </button>
                            <a
                              href={post.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium py-1 rounded transition flex items-center justify-center gap-1"
                              title="ওয়েবসাইটে দেখুন"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ==================== TAB 2: PHOTOCARD GENERATOR (1920x1920) ==================== */}
          {activeTab === 'photocard' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Controls (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-red-500" /> ফটোকার্ড ডিজাইন কন্ট্রোল
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-mono font-bold">
                      1920x1920 PX
                    </span>
                  </div>

                  {/* WordPress Quick Select */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-blue-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" /> ওয়ার্ডপ্রেস সংবাদ অটো-লোড (dnbangla.com.bd)
                      </label>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded font-semibold">
                        লাইভ সিঙ্ক
                      </span>
                    </div>

                    <select
                      value={currentWpIndex}
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        setCurrentWpIndex(idx);
                        if (wpPosts[idx]) loadWpPostIntoPhotocard(wpPosts[idx]);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 truncate"
                    >
                      {wpPosts.map((p, idx) => (
                        <option key={p.id || idx} value={idx}>
                          {idx + 1}. {p.cleanTitle.substring(0, 45)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 1. Header Colors */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" /> ১. টপ হেডার ব্যাকগ্রাউন্ড কালার (0px-80px)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setTopBgColor('#ffffff'); setTopTextColor('#111111'); }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200"
                      >
                        ডিফল্ট (হোয়াইট)
                      </button>
                      <div className="flex-1 flex items-center gap-2 bg-slate-900 px-3 py-1 border border-slate-700 rounded">
                        <span className="text-[11px] text-slate-400">হেডার ব্যাক:</span>
                        <input
                          type="color"
                          value={topBgColor}
                          onChange={(e) => setTopBgColor(e.target.value)}
                          className="w-7 h-6 bg-transparent rounded cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-400 ml-1">তারিখ:</span>
                        <input
                          type="color"
                          value={topTextColor}
                          onChange={(e) => setTopTextColor(e.target.value)}
                          className="w-7 h-6 bg-transparent rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Headline Colors */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" /> ২. হেডলাইনের ব্যাকগ্রাউন্ড কালার (1165px-1563px)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setBottomBgColor('#840b0b'); setHeadlineTextColor('#ffffff'); }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200"
                      >
                        ডিফল্ট (মেরুন)
                      </button>
                      <div className="flex-1 flex items-center gap-2 bg-slate-900 px-3 py-1 border border-slate-700 rounded">
                        <span className="text-[11px] text-slate-400">ব্যাক:</span>
                        <input
                          type="color"
                          value={bottomBgColor}
                          onChange={(e) => setBottomBgColor(e.target.value)}
                          className="w-7 h-6 bg-transparent rounded cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-400 ml-1">ফন্ট:</span>
                        <input
                          type="color"
                          value={headlineTextColor}
                          onChange={(e) => setHeadlineTextColor(e.target.value)}
                          className="w-7 h-6 bg-transparent rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date Controls */}
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
                        তারিখ ও ফন্ট কন্ট্রোল (টপ হেডার)
                      </label>
                      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                          type="button"
                          onClick={() => { setDateMode('auto'); setDateValue(getDhakaDateInputValue()); }}
                          className={`px-2 py-0.5 text-[11px] rounded transition ${
                            dateMode === 'auto'
                              ? 'bg-blue-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          অটো তারিখ
                        </button>
                        <button
                          type="button"
                          onClick={() => setDateMode('custom')}
                          className={`px-2 py-0.5 text-[11px] rounded transition ${
                            dateMode === 'custom'
                              ? 'bg-red-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          কাস্টম তারিখ / টেক্সট
                        </button>
                      </div>
                    </div>

                    {dateMode === 'auto' ? (
                      <div className="space-y-1.5">
                        <input
                          type="date"
                          value={dateValue}
                          onChange={(e) => setDateValue(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200"
                        />
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>প্রদর্শিত তারিখ:</span>
                          <strong className="text-emerald-400 font-bold">{getDisplayDate()}</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={customDateText}
                          onChange={(e) => setCustomDateText(e.target.value)}
                          placeholder="যেমন: ২৭ অক্টোবর ২০২৬ বা ঢাকা, ২৭ অক্টোবর"
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400">সংখ্যা শৈলী:</span>
                          <button
                            type="button"
                            onClick={() => { setDateNumStyle('bn'); setCustomDateText(toBengaliNumber(customDateText)); }}
                            className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                              dateNumStyle === 'bn'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            বাংলা সংখ্যা (০-৯)
                          </button>
                          <button
                            type="button"
                            onClick={() => { setDateNumStyle('en'); setCustomDateText(toEnglishNumber(customDateText)); }}
                            className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                              dateNumStyle === 'en'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            ইংরেজি সংখ্যা (0-9)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDateNumStyle('raw')}
                            className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                              dateNumStyle === 'raw'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            হুবহু লেখা
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Font Family Selector for Date & Header */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-300 flex items-center gap-1">
                        <Type className="w-3.5 h-3.5 text-amber-400" />
                        তারিখের বাংলা ফন্ট:
                      </span>
                      <select
                        value={dateFont}
                        onChange={(e) => setDateFont(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-red-500"
                      >
                        <option value="Hind Siliguri">Hind Siliguri (বোল্ড ও স্ট্যান্ডার্ড)</option>
                        <option value="Noto Sans Bengali">Noto Sans Bengali (ক্লিয়ার ও আধুনিক)</option>
                        <option value="Tiro Bangla">Tiro Bangla (চিরায়ত রূপ)</option>
                        <option value="Anek Bangla">Anek Bangla (গাঢ় রূপ)</option>
                        <option value="SutonnyMJ">SutonnyMJ / সুতন্বী সমমান বোল্ড</option>
                      </select>
                    </div>
                  </div>

                  {/* "বিস্তারিত কমেন্টে" Badge */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-emerald-400">
                        "বিস্তারিত কমেন্টে" রাউন্ড ব্যাজ (1090px - 1165px)
                      </label>
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={commentBadge}
                          onChange={(e) => setCommentBadge(e.target.checked)}
                          className="rounded accent-emerald-500"
                        />
                        <span>চালু / বন্ধ</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200"
                    />
                  </div>

                  {/* Headline & Sliders */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-red-400 mb-1">
                      শিরোনাম / মূল হেডিং (1165px - 1563px = 398px):
                    </label>
                    <textarea
                      rows={3}
                      value={headline}
                      onChange={(e) => {
                        setHeadline(e.target.value);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-red-500"
                    />

                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>হেডলাইন ফন্ট সাইজ:</span>
                          <span className="font-bold text-amber-400">{fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="120"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full accent-red-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>ডানে-বামে মার্জিন:</span>
                          <span className="font-bold text-amber-400">{margin}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="450"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                          className="w-full accent-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature Photo Upload */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> সংবাদের ফিচার ছবি আপলোড করুন (1920x1080px):
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturePhotoUpload}
                      className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 cursor-pointer"
                    />
                  </div>

                  {/* Ad Banner Selection */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-amber-400">
                        বিজ্ঞাপনের ব্যানার নির্বাচন (1640px - 1920px)
                      </label>
                      <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {adBanners.length} টি সংযুক্ত
                      </span>
                    </div>

                    <select
                      value={currentAdIndex}
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        setCurrentAdIndex(idx);
                        trackAction('বিজ্ঞাপন ব্যানার পরিবর্তন', 'ad_rotate', headline, `ব্যানার: ${adBanners[idx]?.name}`);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                    >
                      {adBanners.map((ad, idx) => (
                        <option key={ad.id || idx} value={idx}>
                          {ad.name} ({ad.desc.substring(0, 30)}...)
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const nextIdx = (currentAdIndex + 1) % adBanners.length;
                        setCurrentAdIndex(nextIdx);
                        showToast(`পরবর্তী বিজ্ঞাপন লোড হয়েছে: ${adBanners[nextIdx]?.name}`);
                        trackAction('বিজ্ঞাপন রোটেট (Next Cycle)', 'ad_rotate', headline, `ব্যানার: ${adBanners[nextIdx]?.name}`);
                      }}
                      className="w-full py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded text-xs font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> পরবর্তী বিজ্ঞাপনে ঘুরান (Next Cycle)
                    </button>
                  </div>

                  {/* Download Action */}
                  <button
                    onClick={() => downloadCanvasAsPng(photocardCanvasRef.current, 'DN-Bangla-1920x1920-Photocard.png', headline)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" /> HD ফটোকার্ড ডাউনলোড (1920x1920 PX)
                  </button>
                </div>

                {/* Right Preview (7 cols) */}
                <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col items-center justify-between min-h-[500px]">
                  <div className="w-full flex justify-between items-center mb-3">
                    <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-400" /> ১৯২০ x ১৯২০ PX ক্যানভাস প্রিভিউ
                    </h4>
                    <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 font-mono">
                      1920x1920 Square
                    </span>
                  </div>

                  {/* Canvas Container */}
                  <div className="w-full flex justify-center items-center py-2 relative">
                    <canvas
                      ref={photocardCanvasRef}
                      width={1920}
                      height={1920}
                      className="w-full max-w-[500px] aspect-square rounded-xl border border-slate-700 shadow-2xl bg-white object-contain"
                    />
                  </div>

                  {/* Bottom details capsule */}
                  <div className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span>
                      বর্তমান প্রস্তুতকারী: <strong className="text-white">{currentUser.name || currentUser.email}</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      রেজোলিউশন: 1920x1920 Full HD Square
                    </span>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* ==================== TAB 3: TEXT / TRIGGER PHOTOCARD ==================== */}
          {activeTab === 'texttrigger' && (
            <section className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-amber-500" /> টেক্সট / টিগার ফটোকার্ড জেনারেটর (1920x1920px)
                  </h3>
                  <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded">
                    সেন্টার্ড এলাইনমেন্ট
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ব্যাকগ্রাউন্ড স্টাইল / কালার:
                      </label>
                      <select
                        value={ttBgStyle}
                        onChange={(e) => setTtBgStyle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white"
                      >
                        <option value="gradient-red">DN Bangla Red Gradient</option>
                        <option value="gradient-blue">Deep Slate Night</option>
                        <option value="gradient-maroon">Maroon Classic Event</option>
                        <option value="gradient-dark">Dark Minimal</option>
                        <option value="custom">Custom Color</option>
                      </select>
                      {ttBgStyle === 'custom' && (
                        <div className="flex items-center gap-2 mt-2">
                          <label className="text-[11px] text-slate-400">কাস্টম কালার:</label>
                          <input
                            type="color"
                            value={ttCustomColor}
                            onChange={(e) => setTtCustomColor(e.target.value)}
                            className="w-9 h-7 bg-transparent rounded cursor-pointer"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        উপরে ছোট ক্যাটাগরি:
                      </label>
                      <input
                        type="text"
                        value={ttCategory}
                        onChange={(e) => setTtCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        মূল বার্তা (সর্বদা সেন্টারে থাকবে):
                      </label>
                      <textarea
                        rows={4}
                        value={ttContent}
                        onChange={(e) => setTtContent(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white text-center"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>বার্তা ফন্ট সাইজ:</span>
                        <span className="text-amber-400 font-bold">{ttFontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="120"
                        value={ttFontSize}
                        onChange={(e) => setTtFontSize(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>বাম ও ডান মার্জিন:</span>
                        <span className="text-amber-400 font-bold">{ttMargin}px</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="450"
                        value={ttMargin}
                        onChange={(e) => setTtMargin(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        onClick={() => {
                          const nextIdx = (textAdIndex + 1) % adBanners.length;
                          setTextAdIndex(nextIdx);
                          showToast(`পরবর্তী বিজ্ঞাপনসহ টেক্সট কার্ড রিফ্রেশ: ${adBanners[nextIdx]?.name}`);
                          trackAction('টেক্সট কার্ড বিজ্ঞাপন পরিবর্তন', 'ad_rotate', ttContent, `ব্যানার: ${adBanners[nextIdx]?.name}`);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs shadow flex items-center justify-center gap-2 transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> পরবর্তী বিজ্ঞাপনসহ নতুন টেক্সট ফটোকার্ড তৈরি
                      </button>

                      <button
                        onClick={() => downloadCanvasAsPng(textTriggerCanvasRef.current, 'DN-Bangla-Text-Photocard-1920x1920.png', ttContent)}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg text-xs shadow flex items-center justify-center gap-2 transition"
                      >
                        <Download className="w-4 h-4" /> টেক্সট ফটোকার্ড ডাউনলোড (1920x1920)
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="flex flex-col items-center justify-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <canvas
                      ref={textTriggerCanvasRef}
                      width={1920}
                      height={1920}
                      className="w-full max-w-[450px] aspect-square rounded-xl border border-slate-700 shadow-2xl object-contain"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================== TAB 4: AD MANAGER ==================== */}
          {activeTab === 'admanager' && (
            <section className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-500" /> লোকাল এড ম্যানেজার ও ব্যানার ব্যবস্থাপনা
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      বিজ্ঞাপনের ব্যানারগুলো ব্রাউজারের লোকাল স্টোরেজে স্থায়ীভাবে সংরক্ষিত রয়েছে।
                    </p>
                  </div>

                  {/* Admin Only Restore */}
                  <button
                    onClick={() => {
                      handleAdminOnlyAction('ডিফল্ট ব্যানার রিস্টোর', () => {
                        setAdBanners(DEFAULT_ADS);
                        localStorage.setItem('dnbangla_permanent_ads_v3', JSON.stringify(DEFAULT_ADS));
                        showToast('ডিফল্ট ৫টি ব্যানার সফলভাবে রিস্টোর হয়েছে!');
                      });
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                      isAdmin
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                        : 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> ডিফল্ট ৫টি ব্যানার রিস্টোর
                    {isReporter && <Lock className="w-3 h-3 text-slate-500 ml-1" />}
                  </button>
                </div>

                {isReporter && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>রিপোর্টার ভিউ মোড: আপনি সকল বিজ্ঞাপন ব্যানার দেখতে পারবেন এবং ফটোকার্ডে ব্যবহারের জন্য সিলেক্ট করতে পারবেন, তবে নতুন বিজ্ঞাপন যুক্ত বা ডিলিট কেবল এডমিন করতে পারবেন।</span>
                  </div>
                )}

                {/* Upload Form - Admin Protected */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> নতুন বিজ্ঞাপন ব্যানার আপলোড
                    </h4>
                    {isReporter && (
                      <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        এডমিন সুরক্ষিত
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">বিজ্ঞাপনের নাম:</label>
                      <input
                        type="text"
                        disabled={isReporter}
                        id="new-ad-name-input"
                        placeholder="যেমন: বিজ্ঞাপন ব্যানার 06"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">বিবরণ / ফোন:</label>
                      <input
                        type="text"
                        disabled={isReporter}
                        id="new-ad-desc-input"
                        placeholder="যেমন: ব্র্যান্ড বিবরণ বা যোগাযোগ"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">ব্যানার ছবি ফাইল:</label>
                      <input
                        type="file"
                        disabled={isReporter}
                        id="new-ad-file-input"
                        accept="image/*"
                        className="w-full text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-800 file:text-slate-200 disabled:opacity-50 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAdminOnlyAction('বিজ্ঞাপন আপলোড', () => {
                        const nameEl = document.getElementById('new-ad-name-input') as HTMLInputElement;
                        const descEl = document.getElementById('new-ad-desc-input') as HTMLInputElement;
                        const fileEl = document.getElementById('new-ad-file-input') as HTMLInputElement;
                        const name = nameEl?.value.trim();
                        const desc = descEl?.value.trim();
                        const file = fileEl?.files?.[0];

                        if (!name) {
                          showToast('দয়া করে বিজ্ঞাপনের নাম লিখুন।', 'error');
                          return;
                        }
                        if (!file) {
                          showToast('দয়া করে ব্যানার ছবি নির্বাচন করুন।', 'error');
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const newAd: AdBanner = {
                            id: 'ad-' + Date.now(),
                            name,
                            desc: desc || 'বিশেষ বিজ্ঞাপন',
                            image: e.target?.result as string
                          };
                          const updated = [...adBanners, newAd];
                          setAdBanners(updated);
                          localStorage.setItem('dnbangla_permanent_ads_v3', JSON.stringify(updated));
                          showToast(`ব্যানার "${name}" সফলভাবে যুক্ত করা হয়েছে!`);
                          trackAction('নতুন বিজ্ঞাপন ব্যানার যুক্ত', 'other', undefined, `ব্যানার নাম: ${name}`);
                          nameEl.value = '';
                          descEl.value = '';
                          fileEl.value = '';
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                    disabled={isReporter}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-2 rounded text-xs transition flex items-center justify-center gap-2 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> বিজ্ঞাপনে যুক্ত ও সংরক্ষণ করুন
                  </button>
                </div>

                {/* Ads Grid */}
                <h4 className="font-bold text-xs text-slate-300 pt-2">সংরক্ষিত বিজ্ঞাপন ব্যানার তালিকা ({adBanners.length} টি):</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {adBanners.map((ad, idx) => (
                    <div key={ad.id || idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                      <div className="aspect-video w-full rounded overflow-hidden relative bg-slate-900">
                        <img
                          src={ad.localFallback || ad.image}
                          alt={ad.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (ad.image && (e.currentTarget as HTMLImageElement).src !== ad.image) {
                              (e.currentTarget as HTMLImageElement).src = ad.image;
                            }
                          }}
                        />
                        <span className="absolute top-1 left-1 bg-amber-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">
                          ব্যানার #{idx + 1}
                        </span>
                      </div>

                      <h4 className="font-semibold text-xs text-slate-200 truncate">{ad.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{ad.desc}</p>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => {
                            setCurrentAdIndex(idx);
                            setActiveTab('photocard');
                            showToast(`ফটোকার্ডে "${ad.name}" সেট করা হয়েছে।`);
                          }}
                          className="flex-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 py-1 rounded transition text-center"
                        >
                          সিলেক্ট করুন
                        </button>
                        <button
                          onClick={() => {
                            handleAdminOnlyAction('বিজ্ঞাপন ডিলিট', () => {
                              if (adBanners.length <= 1) {
                                showToast('অন্তত একটি বিজ্ঞাপন থাকা আবশ্যক!', 'error');
                                return;
                              }
                              if (confirm(`আপনি কি "${ad.name}" মুছে ফেলতে চান?`)) {
                                const updated = adBanners.filter((_, i) => i !== idx);
                                setAdBanners(updated);
                                localStorage.setItem('dnbangla_permanent_ads_v3', JSON.stringify(updated));
                                showToast('বিজ্ঞাপনটি মুছে ফেলা হয়েছে।');
                                trackAction('বিজ্ঞাপন ডিলিট', 'other', undefined, `মুছে ফেলা ব্যানার: ${ad.name}`);
                              }
                            });
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] transition ${
                            isAdmin
                              ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                              : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                          }`}
                          title="বিজ্ঞাপন মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ==================== TAB 5: DAILY SCHEDULE ==================== */}
          {activeTab === 'schedule' && (
            <section className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-red-500" /> দৈনিক সময়সূচি ভিত্তিক অটো শিডিউলার
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      প্রতিদিনের সকাল, দুপুর ও রাতের বুলেটিন ফটোকার্ডের রুটিন। যেকোনো সংবাদের বোতাম চেপে সরাসরি ফটোকার্ড বা টিগারে লোড করুন।
                    </p>
                  </div>
                </div>

                {/* Morning Shift */}
                <div className="space-y-3">
                  <h4 className="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Sun className="w-4 h-4 text-amber-400" /> ১. সকালের বুলেটিন রুটিন (ভোর ৬:০০ - সকাল ৯:০০)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Morning Wish */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold">ভোর ০৬:০০ টা</span>
                        <h5 className="text-xs font-bold text-white">🌅 শুভ সকাল অনুপ্রেরণা</h5>
                        <p className="text-[11px] text-slate-300">একটি নতুন সকাল আপনার জীবনে অফুরন্ত সাফল্য ও বরকত বয়ে আনুক — ডিএন বাংলা</p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setTtCategory('🌅 শুভ সকাল অনুপ্রেরণা');
                            setTtContent('একটি নতুন সকাল আপনার জীবনে অফুরন্ত সাফল্য ও বরকত বয়ে আনুক — ডিএন বাংলা');
                            setActiveTab('texttrigger');
                            trackAction('শিডিউলার থেকে টিগার কার্ডে পাঠানো', 'schedule_send', 'শুভ সকাল অনুপ্রেরণা');
                          }}
                          className="flex-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 py-1.5 rounded text-center"
                        >
                          টিগারে পাঠান
                        </button>
                        <button
                          onClick={() => {
                            setHeadline('শুভ সকাল: একটি নতুন সকাল আপনার জীবনে অফুরন্ত সাফল্য ও বরকত বয়ে আনুক');
                            setActiveTab('photocard');
                            trackAction('শিডিউলার থেকে ফটোকার্ডে লোড', 'schedule_send', 'শুভ সকাল বার্তা');
                          }}
                          className="flex-1 text-[11px] bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 rounded text-center"
                        >
                          ফটোকার্ডে লোড
                        </button>
                      </div>
                    </div>

                    {/* Morning Weather */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono font-bold">সকাল ০৬:৩০ টা</span>
                        <h5 className="text-xs font-bold text-white">🌦️ সকালের আবহাওয়ার বার্তা</h5>
                        <p className="text-[11px] text-slate-300">আজকের সকালের আবহাওয়া: সর্বনিম্ন তাপমাত্রা ২২° সে., নদী অববাহিকায় হালকা কুয়াশা ও সারাদিন আকাশ আংশিক মেঘলা থাকবে।</p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setTtCategory('🌦️ আজকের আবহাওয়ার বার্তা');
                            setTtContent('আজকের সকালের আবহাওয়া: সর্বনিম্ন তাপমাত্রা ২২° সে., নদী অববাহিকায় হালকা কুয়াশা ও সারাদিন আকাশ আংশিক মেঘলা থাকবে।');
                            setActiveTab('texttrigger');
                            trackAction('শিডিউলার থেকে টিগার কার্ডে পাঠানো', 'schedule_send', 'সকালের আবহাওয়া');
                          }}
                          className="flex-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 py-1.5 rounded text-center"
                        >
                          টিগারে পাঠান
                        </button>
                        <button
                          onClick={() => {
                            setHeadline('সকালের আবহাওয়া: সর্বনিম্ন তাপমাত্রা ২২° সে., নদী অববাহিকায় কুয়াশা ও আংশিক মেঘলা আকাশ');
                            setActiveTab('photocard');
                            trackAction('শিডিউলার থেকে ফটোকার্ডে লোড', 'schedule_send', 'আবহাওয়া বুলেটিন');
                          }}
                          className="flex-1 text-[11px] bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 rounded text-center"
                        >
                          ফটোকার্ডে লোড
                        </button>
                      </div>
                    </div>

                    {/* Prayer Time */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold">সকাল ০৭:০০ টা</span>
                        <h5 className="text-xs font-bold text-white">🕌 ৫ ওয়াক্ত নামাজের সময়সূচি</h5>
                        <p className="text-[11px] text-slate-300">ঢাকা: ফজর ৪:৫২, যোহর ১১:৫৮, আসর ৩:১৫, মাগরিব ৫:১৯, এশা ৬:৩৬ | সেহরি ৪:১৮, ইফতার ৬:১৮</p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setTtCategory('🕌 দৈনিক নামাজের সময়সূচি');
                            setTtContent('ঢাকা: ফজর ৪:৫২, যোহর ১১:৫৮, আসর ৩:১৫, মাগরিব ৫:১৯, এশা ৬:৩৬');
                            setActiveTab('texttrigger');
                            trackAction('শিডিউলার থেকে টিগার কার্ডে পাঠানো', 'schedule_send', 'নামাজের সময়সূচি');
                          }}
                          className="flex-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-300 py-1.5 rounded text-center"
                        >
                          টিগারে পাঠান
                        </button>
                        <button
                          onClick={() => {
                            setHeadline('আজকের নামাজের সময়সূচি: ফজর ৪:৫২, যোহর ১১:৫৮, আসর ৩:১৫, মাগরিব ৫:১৯, এশা ৬:৩৬');
                            setActiveTab('photocard');
                            trackAction('শিডিউলার থেকে ফটোকার্ডে লোড', 'schedule_send', 'নামাজের সময়সূচি');
                          }}
                          className="flex-1 text-[11px] bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 rounded text-center"
                        >
                          ফটোকার্ডে লোড
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Night Top 10 */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs md:text-sm font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Moon className="w-4 h-4 text-indigo-400" /> ২. রাতের সেরা টপ-টেন (Top 10) নিউজ বুলেটিন (রাত ১০:০০ - ১১:০০)
                  </h4>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                        রাত ১০:৩০ টা
                      </span>
                      <span className="text-xs font-bold text-white">ওয়েবসাইটের প্রকাশিত সেরা সংবাদের সারসংক্ষেপ</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const topHeadlines = wpPosts.slice(0, 5).map((p, i) => `${toBengaliNumber(i + 1)}. ${p.cleanTitle}`).join('\n');
                          setTtCategory('🏆 আজকের শীর্ষ সংবাদ বুলেটিন');
                          setTtContent(topHeadlines || '১. ডিজিটাল অটোমেশন ফটোকার্ড ইঞ্জিন চালু\n২. নির্বাচন সংক্রান্ত সার্বিক প্রস্তুতি সম্পন্ন');
                          setActiveTab('texttrigger');
                          trackAction('টপ-টেন নিউজ বুলেটিন টিগারে পাঠানো', 'schedule_send', 'রাতের টপ-টেন বুলেটিন');
                        }}
                        className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                      >
                        শীর্ষ ৫টি সংবাদ দিয়ে টিগার কার্ড বানান
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================== TAB 6: STAFF DIRECTORY & ID CARD ==================== */}
          {activeTab === 'staff' && (
            <section className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
                      <IdCard className="w-4 h-4 text-emerald-500" /> প্রতিষ্ঠানে কর্মরত সকলের তথ্যভান্ডার ও প্রেস আইডি কার্ড
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      সকল সাংবাদিক ও কর্মকর্তা-কর্মচারীর তথ্যভান্ডার এবং কাস্টম ডিজিটাল প্রেস আইডি কার্ড জেনারেটর।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        handleAdminOnlyAction('নতুন কর্মী যুক্ত করা', () => {
                          setIsStaffFormOpen(!isStaffFormOpen);
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isAdmin
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                          : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> নতুন কর্মী যুক্ত করুন
                      {isReporter && <Lock className="w-3 h-3 text-slate-500 ml-1" />}
                    </button>
                  </div>
                </div>

                {/* Add Staff Form - Admin Protected */}
                {isStaffFormOpen && isAdmin && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-fade-in">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> নতুন কর্মীর তথ্য ফরম
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">পূর্ণ নাম *</label>
                        <input
                          type="text"
                          value={newStaff.name}
                          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                          placeholder="যেমন: তানভীর আহমেদ"
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">পদবী *</label>
                        <input
                          type="text"
                          value={newStaff.designation}
                          onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                          placeholder="যেমন: সিনিয়র রিপোর্টার"
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">আইডি নম্বর *</label>
                        <input
                          type="text"
                          value={newStaff.id}
                          onChange={(e) => setNewStaff({ ...newStaff, id: e.target.value })}
                          placeholder="DN-2026-105"
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">মোবাইল নম্বর *</label>
                        <input
                          type="text"
                          value={newStaff.phone}
                          onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                          placeholder="017xxxxxxxx"
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setIsStaffFormOpen(false)}
                        className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={() => {
                          if (!newStaff.name || !newStaff.designation || !newStaff.id) {
                            showToast('দয়া করে নাম, পদবী এবং আইডি নম্বর পূরণ করুন।', 'error');
                            return;
                          }
                          const member: StaffMember = {
                            id: newStaff.id,
                            name: newStaff.name,
                            designation: newStaff.designation,
                            dept: newStaff.dept,
                            blood: newStaff.blood,
                            phone: newStaff.phone,
                            validity: newStaff.validity,
                            photo: newStaffPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
                          };
                          const updated = [member, ...staffList];
                          setStaffList(updated);
                          localStorage.setItem('dnbangla_staff_directory', JSON.stringify(updated));
                          setSelectedStaffIndex(0);
                          setIsStaffFormOpen(false);
                          showToast(`${member.name}-এর তথ্য সফলভাবে যুক্ত হয়েছে!`);
                          trackAction('নতুন কর্মী নিবন্ধন', 'other', undefined, `আইডি: ${member.id}, পদবী: ${member.designation}`);
                        }}
                        className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>
                )}

                {/* Staff List & Card Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Staff List (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-400" /> কর্মকর্তা ও সাংবাদিকদের তালিকা ({staffList.length} জন)
                      </h4>
                      {isReporter && (
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          রিপোর্টার ভিউ
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                      {staffList.map((st, idx) => {
                        const isSelected = idx === selectedStaffIndex;
                        return (
                          <div
                            key={st.id || idx}
                            onClick={() => setSelectedStaffIndex(idx)}
                            className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-red-950/30 border-red-500/60'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-slate-800">
                                <img src={st.photo} alt={st.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-white">{st.name}</h5>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                                    {st.id}
                                  </span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                                    {st.blood}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  {st.designation} • <span className="text-slate-300">{st.dept}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedStaffIndex(idx); }}
                                className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-amber-300 hover:bg-slate-700"
                              >
                                কার্ড প্রিভিউ
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (staffList.length <= 1) {
                                      showToast('অন্তত ১ জন কর্মী থাকা আবশ্যক।', 'error');
                                      return;
                                    }
                                    if (confirm(`${st.name}-এর তথ্য মুছে ফেলতে চান?`)) {
                                      const updated = staffList.filter((_, i) => i !== idx);
                                      setStaffList(updated);
                                      localStorage.setItem('dnbangla_staff_directory', JSON.stringify(updated));
                                      setSelectedStaffIndex(0);
                                      showToast('কর্মীর তথ্য মুছে ফেলা হয়েছে।');
                                      trackAction('কর্মী অপসারণ', 'other', undefined, `আইডি: ${st.id}, নাম: ${st.name}`);
                                    }
                                  }}
                                  className="text-[11px] px-2 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ID Card Preview Canvas (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <IdCard className="w-3.5 h-3.5 text-red-500" /> ডিজিটাল প্রেস আইডি কার্ড
                      </h4>
                      <div className="flex gap-1 text-[11px]">
                        <button
                          onClick={() => setCardSide('front')}
                          className={`px-2.5 py-1 rounded font-semibold transition ${
                            cardSide === 'front' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          ফ্রন্ট সাইড
                        </button>
                        <button
                          onClick={() => setCardSide('back')}
                          className={`px-2.5 py-1 rounded font-semibold transition ${
                            cardSide === 'back' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          ব্যাক সাইড
                        </button>
                      </div>
                    </div>

                    {/* Canvas */}
                    <div className="flex justify-center items-center py-1">
                      <canvas
                        ref={staffCardCanvasRef}
                        width={600}
                        height={920}
                        className="w-[280px] h-[430px] rounded-xl shadow-2xl border-2 border-slate-700 bg-white object-contain"
                      />
                    </div>

                    <div className="w-full space-y-2 pt-2 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => {
                          const st = staffList[selectedStaffIndex] || staffList[0];
                          downloadCanvasAsPng(
                            staffCardCanvasRef.current,
                            `DN-PressCard-${st?.id || 'ID'}-${cardSide}.png`,
                            `${st?.name} প্রেস আইডি কার্ড`
                          );
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 shadow transition"
                      >
                        <Download className="w-4 h-4" /> HD প্রেস কার্ড ডাউনলোড
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================== TAB 7: INTEGRATIONS ==================== */}
          {activeTab === 'integrations' && (
            <section className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-500" /> ওয়ার্ডপ্রেস ও সোশ্যাল মিডিয়া API সেটিংস
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      WordPress সাইট এবং Facebook, X, Instagram, TikTok, Telegram, Threads সহ সকল সোশ্যাল মিডিয়ার API কনফিগারেশন।
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleAdminOnlyAction('API সেটিংস সংরক্ষণ', () => {
                        showToast('সকল API কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
                        trackAction('API সেটিংস আপডেট', 'other', undefined, 'সোশ্যাল ও ওয়ার্ডপ্রেস কনফিগারেশন');
                      });
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition ${
                      isAdmin
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> সকল সেটিংস সংরক্ষণ
                    {isReporter && <Lock className="w-3 h-3 text-slate-500 ml-1" />}
                  </button>
                </div>

                {isReporter && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>রিপোর্টার ভিউ মোড: আপনি API স্ট্যাটাস ও তথ্য দেখতে পারবেন, তবে কী (Keys) বা ক্রেডেনশিয়াল পরিবর্তনের অধিকার শুধুমাত্র এডমিনের।</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WordPress REST API */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">WP</span>
                        ওয়ার্ডপ্রেস (WordPress REST API)
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        সংযুক্ত (Active)
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-0.5">সাইট ইউআরএল (Site URL):</label>
                        <input
                          type="text"
                          disabled={isReporter}
                          defaultValue="https://dnbangla.com.bd"
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 font-mono disabled:opacity-50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 mb-0.5">ইউজারনেম:</label>
                          <input
                            type="text"
                            disabled={isReporter}
                            defaultValue="dnb_editor"
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-0.5">অ্যাপ পাসওয়ার্ড:</label>
                          <input
                            type="password"
                            disabled={isReporter}
                            defaultValue="••••••••••••"
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 font-mono disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Facebook Page Graph API */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">f</span>
                        ফেসবুক পেজ (Facebook Graph API)
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        প্রস্তুত
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-0.5">পেজ আইডি (Page ID):</label>
                        <input
                          type="text"
                          disabled={isReporter}
                          defaultValue="dnbanglaN"
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 font-mono disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-0.5">Page Access Token:</label>
                        <input
                          type="password"
                          disabled={isReporter}
                          defaultValue="EAAG••••••••••••••••"
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 font-mono disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================== TAB 8: ADMIN-ONLY REPORTER AUDIT TRACKER ==================== */}
          {activeTab === 'audit' && (
            <ReporterAuditView
              logs={auditLogs}
              onRefreshLogs={() => setAuditLogs(getAuditLogs())}
              onSelectHeadline={(hl) => {
                setHeadline(hl);
                setActiveTab('photocard');
                showToast(`অডিট লগ থেকে শিরোনাম ফটোকার্ডে লোড হয়েছে!`);
              }}
            />
          )}

          {/* ==================== TAB 9: LIVE SYSTEM LOGS ==================== */}
          {activeTab === 'logs' && (
            <section className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-500" /> লাইভ সিস্টেম অটোমেশন লগস
                  </h3>
                  {isAdmin && (
                    <button
                      onClick={() => setSystemLogs([`[${new Date().toLocaleTimeString()}] Logs cleared by admin.`])}
                      className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded"
                    >
                      লগ পরিষ্কার
                    </button>
                  )}
                </div>
                <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-emerald-400 h-64 overflow-y-auto space-y-2 border border-slate-800">
                  {systemLogs.map((l, i) => (
                    <p key={i}>{l}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Standalone HTML & CPanel / Hosting Package Download Modal */}
      <DownloadPackageModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
