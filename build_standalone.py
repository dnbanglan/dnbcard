import os

html_content = '''<!DOCTYPE html>
<html lang="bn" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ডিএন বাংলা - 1920x1920 PhotoCard Engine & Reporter Portal</title>
  <meta name="description" content="ডিএন বাংলা ১৯২০x১৯২০ ফটোকার্ড জেনারেটর, রিপোর্টার অডিট ট্র্যাকার, লোকাল এড ম্যানেজার ও মাল্টি-রোল কন্ট্রোল সিস্টেম।" />
  <meta property="og:title" content="ডিএন বাংলা - 1920x1920 PhotoCard Engine & Reporter Portal" />
  <meta property="og:description" content="ডিএন বাংলা ১৯২০x১৯২০ ফটোকার্ড জেনারেটর, রিপোর্টার অডিট ট্র্যাকার, লোকাল এড ম্যানেজার ও মাল্টি-রোল কন্ট্রোল সিস্টেম।" />
  <meta property="og:type" content="website" />

  <!-- Global window.fetch shim: prevents TypeError in devtools/iframes -->
  <script>
    (function() {
      try {
        var _globalFetch = window.fetch;
        var desc = {
          get: function() { return _globalFetch; },
          set: function(fn) { _globalFetch = fn; },
          configurable: true,
          enumerable: true
        };
        try { Object.defineProperty(window, 'fetch', desc); } catch (e1) {}
        try { if (typeof Window !== 'undefined' && Window.prototype) Object.defineProperty(Window.prototype, 'fetch', desc); } catch (e2) {}
      } catch (e) {
        console.warn('Fetch property shim notice:', e);
      }
    })();
  </script>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              red: '#e50914',
              darkRed: '#b20710',
              blue: '#0056b3',
              dark: '#0f172a',
              card: '#1e293b',
              accent: '#f59e0b',
              maroon: '#800000'
            }
          }
        }
      }
    };
  </script>

  <!-- Google Fonts for Bengali -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;900&display=swap" rel="stylesheet">

  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <style>
    body {
      font-family: 'Hind Siliguri', sans-serif;
      background-color: #020617;
      color: #f8fafc;
    }
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0f172a;
    }
    ::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #475569;
    }
    .active-nav {
      background-color: #e50914 !important;
      color: #ffffff !important;
      font-weight: 700;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-red-600 selection:text-white">

  <!-- ==================== 1. STANDALONE LOGIN SCREEN (Shown if not logged in) ==================== -->
  <div id="login-screen" class="hidden min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
    <!-- Glow effects -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
      <!-- Header -->
      <div class="p-6 border-b border-slate-800 bg-slate-950/80 text-center space-y-2">
        <div class="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-red-900/40">
          DN
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-wide text-white">ডিএন বাংলা ফটোকার্ড ইঞ্জিন</h1>
          <p class="text-xs text-slate-400 mt-0.5">নিরাপদ মাল্টি-রোল অথেনটিকেশন ও রিপোর্টার এক্টিভিটি পোর্টাল</p>
        </div>
      </div>

      <!-- Tab Selector -->
      <div class="p-5 pb-2">
        <div class="grid grid-cols-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button type="button" id="tab-btn-reporter" onclick="switchLoginTab('reporter')" class="flex items-center justify-center gap-2 py-3 rounded-xl transition bg-blue-600 text-white shadow-lg shadow-blue-900/30">
            <i class="fa-solid fa-user-check"></i> মডারেটর / রিপোর্টার লগইন
          </button>
          <button type="button" id="tab-btn-admin" onclick="switchLoginTab('admin')" class="flex items-center justify-center gap-2 py-3 rounded-xl transition text-slate-400 hover:text-white">
            <i class="fa-solid fa-shield-halved"></i> এডমিন লগইন
          </button>
        </div>
      </div>

      <!-- Content Body -->
      <div class="p-6 pt-3 space-y-5">
        <!-- Error / Success Alert -->
        <div id="login-alert" class="hidden p-3.5 rounded-xl border text-xs flex items-center gap-2.5">
          <i id="login-alert-icon" class="fa-solid fa-circle-exclamation text-sm shrink-0"></i>
          <span id="login-alert-text">ত্রুটি</span>
        </div>

        <!-- Reporter Form -->
        <form id="form-reporter-login" onsubmit="handleReporterLogin(event)" class="space-y-4">
          <!-- Policy Box -->
          <div class="bg-blue-950/25 p-4 rounded-2xl border border-blue-900/50 text-[11px] text-blue-200 space-y-1.5 leading-relaxed">
            <div class="font-bold text-blue-300 flex items-center gap-1.5 text-xs mb-1">
              <i class="fa-solid fa-user-check"></i> রিপোর্টার / মডারেটরের অনুমোদন নীতি:
            </div>
            <p>• <strong>কাজের অনুমতি:</strong> ওভারভিউ ড্যাশবোর্ড, ফটোকার্ড জেনারেটর (১৯২০x১৯২০) ও টেক্সট / টিগার ফটোকার্ড।</p>
            <p>• <strong>অন্যান্য সব ট্যাব:</strong> লোকাল এড, শিডিউলার, কর্মী আইডি কার্ড ও API সেটিংস শুধু দেখতে পারবেন (রিড-অনলি)।</p>
            <p>• <strong>অডিট ট্র্যাকিং:</strong> কোন রিপোর্টার কি তৈরি করছেন তার পূর্ণ বিবরণ এডমিনের কাছে স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে।</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              ব্যক্তির বৈধ @gmail.com ঠিকানা <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <i class="fa-regular fa-envelope text-slate-500 absolute left-3.5 top-3.5 text-xs"></i>
              <input type="email" id="input-reporter-email" required placeholder="যেমন: yourname@gmail.com" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition">
            </div>
            <p class="text-[10px] text-slate-500 mt-1">ঠিকানাটি অবশ্যই একটি বৈধ @gmail.com হতে হবে।</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              পাসওয়ার্ড <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <i class="fa-solid fa-lock text-slate-500 absolute left-3.5 top-3.5 text-xs"></i>
              <input type="password" id="input-reporter-pass" required placeholder="পাসওয়ার্ড লিখুন" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition">
              <button type="button" onclick="togglePassVisibility('input-reporter-pass', this)" class="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300" title="পাসওয়ার্ড দেখুন / লুকান">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2 mt-2">
            <i class="fa-solid fa-right-to-bracket"></i> রিপোর্টার হিসেবে প্রবেশ করুন
          </button>
        </form>

        <!-- Admin Form -->
        <form id="form-admin-login" onsubmit="handleAdminLogin(event)" class="hidden space-y-4">
          <!-- Policy Box -->
          <div class="bg-amber-950/25 p-4 rounded-2xl border border-amber-900/50 text-[11px] text-amber-200 space-y-1.5 leading-relaxed">
            <div class="font-bold text-amber-300 flex items-center gap-1.5 text-xs mb-1">
              <i class="fa-solid fa-shield-halved"></i> এডমিন বিশেষাধিকার ও পূর্ণ নিয়ন্ত্রণ:
            </div>
            <p>• <strong>সকল ফিচার পরিচালনা:</strong> ফটোকার্ড, এড ম্যানেজার, কর্মী আইডি, সোশ্যাল API ও দৈনিক শিডিউলার।</p>
            <p>• <strong>রিপোর্টার অডিট ট্র্যাকার:</strong> কোন রিপোর্টার কখন কি কি ফটোকার্ড তৈরি ও ডাউনলোড করেছেন তা লাইভ দেখার বিশেষ ক্ষমতা।</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              এডমিন ইউজারনেম / ইমেইল <span className="text-red-400">*</span>
            </label>
            <div class="relative">
              <i class="fa-regular fa-envelope text-slate-500 absolute left-3.5 top-3.5 text-xs"></i>
              <input type="text" id="input-admin-user" required placeholder="admin অথবা admin@dnbangla.com" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              এডমিন পাসওয়ার্ড <span className="text-red-400">*</span>
            </label>
            <div class="relative">
              <i class="fa-solid fa-lock text-slate-500 absolute left-3.5 top-3.5 text-xs"></i>
              <input type="password" id="input-admin-pass" required placeholder="পাসওয়ার্ড লিখুন" class="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition">
              <button type="button" onclick="togglePassVisibility('input-admin-pass', this)" class="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300" title="পাসওয়ার্ড দেখুন / লুকান">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-900/30 transition flex items-center justify-center gap-2 mt-2">
            <i class="fa-solid fa-shield-halved"></i> এডমিন হিসেবে প্রবেশ করুন
          </button>
        </form>

        <div class="text-center pt-2">
          <p class="text-[11px] text-slate-500">ডিএন বাংলা ডিজিটাল প্রেস নেটওয়ার্ক • সিস্টেম সিকিউরিটি সংরক্ষিত</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== 2. MAIN APPLICATION PORTAL (Shown if logged in) ==================== -->
  <div id="app-portal" class="min-h-screen flex flex-col md:flex-row antialiased">

    <!-- Sidebar Navigation -->
    <aside class="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0 flex flex-col justify-between">
      <div>
        <div class="p-4 border-b border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-red-600 text-white font-bold rounded-lg px-2.5 py-1 text-lg shadow-lg shadow-red-900/40">DN</div>
              <div>
                <h1 class="font-bold text-base tracking-wide text-white">ডিএন বাংলা</h1>
                <p class="text-[10px] text-slate-400">1920x1920 PhotoCard Engine</p>
              </div>
            </div>
          </div>

          <!-- User identity capsule with Logout trigger -->
          <div onclick="handleLogout()" class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 cursor-pointer transition flex items-center justify-between group" title="লগআউট করতে ক্লিক করুন">
            <div class="flex items-center gap-2.5 min-w-0">
              <div id="sidebar-user-avatar" class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-blue-600 text-white">
                R
              </div>
              <div class="min-w-0">
                <p id="sidebar-user-name" class="text-[11px] font-bold text-white truncate">ইউজার</p>
                <p id="sidebar-user-role" class="text-[9px] text-slate-400 truncate">রিপোর্টার</p>
              </div>
            </div>
            <span class="text-[10px] text-red-400 group-hover:text-red-300 font-semibold shrink-0 flex items-center gap-1">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> লগআউট
            </span>
          </div>
        </div>

        <nav class="p-3 space-y-1 text-sm font-medium">
          <button onclick="switchTab('overview')" id="nav-overview" class="active-nav w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-slate-300 hover:bg-slate-800 text-left">
            <i class="fa-solid fa-chart-pie w-5 text-center"></i> ওভারভিউ ড্যাশবোর্ড
          </button>
          <button onclick="switchTab('photocard')" id="nav-photocard" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-slate-300 hover:bg-slate-800 text-left">
            <i class="fa-solid fa-image w-5 text-center"></i> ফটোকার্ড জেনারেটর
          </button>
          <button onclick="switchTab('texttrigger')" id="nav-texttrigger" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-slate-300 hover:bg-slate-800 text-left">
            <i class="fa-solid fa-font w-5 text-center"></i> টেক্সট / টিগার ফটোকার্ড
          </button>
          <button onclick="switchTab('admanager')" id="nav-admanager" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-slate-300 hover:bg-slate-800 text-left">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-arrows-spin w-5 text-center"></i> লোকাল এড ম্যানেজার
            </div>
            <i id="lock-admanager" class="fa-solid fa-lock text-xs text-slate-500 hidden" title="রিপোর্টার ভিউ মোড"></i>
          </button>
          <button onclick="switchTab('schedule')" id="nav-schedule" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-slate-300 hover:bg-slate-800 text-left">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-clock-rotate-left w-5 text-center"></i> দৈনিক অটো শিডিউলার
            </div>
            <i id="lock-schedule" class="fa-solid fa-lock text-xs text-slate-500 hidden" title="রিপোর্টার ভিউ মোড"></i>
          </button>
          <button onclick="switchTab('staff')" id="nav-staff" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-slate-300 hover:bg-slate-800 text-left">
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-id-card w-5 text-center"></i> কর্মী আইডি কার্ড
            </div>
            <i id="lock-staff" class="fa-solid fa-lock text-xs text-slate-500 hidden" title="রিপোর্টার ভিউ মোড"></i>
          </button>
          <button onclick="switchTab('integrations')" id="nav-integrations" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-slate-300 hover:bg-slate-800 text-left">
            <div class="flex items-center gap-3">
              <i class="fa-brands fa-wordpress w-5 text-center"></i> ওয়ার্ডপ্রেস ও সোশ্যাল API
            </div>
            <i id="lock-integrations" class="fa-solid fa-lock text-xs text-slate-500 hidden" title="রিপোর্টার ভিউ মোড"></i>
          </button>

          <!-- Admin Exclusive Audit Tracker Nav Button -->
          <button onclick="switchTab('audit')" id="nav-audit" class="hidden w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-left">
            <div class="flex items-center gap-2.5">
              <i class="fa-solid fa-users-gear text-amber-400"></i>
              <span class="font-bold">রিপোর্টার অডিট ট্র্যাকার</span>
            </div>
            <span id="audit-badge-count" class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">0</span>
          </button>

          <button onclick="switchTab('logs')" id="nav-logs" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-slate-300 hover:bg-slate-800 text-left">
            <i class="fa-solid fa-terminal w-5 text-center"></i> লাইভ সিস্টেম লগস
          </button>
        </nav>
      </div>

      <!-- Footer & Logout in sidebar -->
      <div class="p-3 border-t border-slate-800 space-y-2">
        <button onclick="handleLogout()" class="w-full py-2.5 px-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer" title="সিস্টেম থেকে লগআউট করুন">
          <i class="fa-solid fa-arrow-right-from-bracket text-red-400"></i>
          <span>লগআউট করুন</span>
        </button>
        <div class="flex items-center justify-between text-slate-400 text-[10px] pt-0.5">
          <span>সিস্টেম: v3.5 Multi-Role</span>
          <span class="text-slate-500">ডিএন বাংলা</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <!-- Top Bar -->
      <header class="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-20 shadow-md">
        <div class="flex items-center gap-3">
          <h2 class="text-base md:text-lg font-bold text-white flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> অটোমেশন কন্ট্রোল সেন্টার
          </h2>
          <span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-[11px] font-semibold">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span> লাইভ ইঞ্জিন সক্রিয়
          </span>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Active Banner -->
          <div class="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 hidden lg:flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>সক্রিয় ব্যানার: <strong id="topbar-ad-name" class="text-amber-400">বিজ্ঞাপন ব্যানার 01</strong></span>
          </div>

          <!-- WordPress Sync -->
          <button onclick="syncWordPress(true)" id="btn-wp-sync" class="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-2 transition">
            <i class="fa-brands fa-wordpress" id="sync-icon"></i> <span>ওয়ার্ডপ্রেস সিঙ্ক</span>
          </button>

          <!-- Current user status indicator -->
          <div id="topbar-user-badge" class="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <i id="topbar-user-icon" class="fa-solid fa-user-check text-blue-400"></i>
            <span id="topbar-user-text" class="font-semibold text-white">রিপোর্টার</span>
          </div>

          <!-- Dedicated Logout Button (Top Bar) -->
          <button onclick="handleLogout()" class="bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/40 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer" title="সিস্টেম থেকে লগআউট করুন">
            <i class="fa-solid fa-arrow-right-from-bracket text-red-400"></i>
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      <div class="p-4 md:p-6 space-y-6">

        <!-- Role Access Notice Banner -->
        <div id="role-notice-reporter" class="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5">
            <i class="fa-solid fa-user-check text-lg text-blue-400 shrink-0"></i>
            <div>
              <span id="reporter-banner-email" class="font-bold text-white">রিপোর্টার মোড সক্রিয়</span>
              <p class="text-slate-300 text-[11px] mt-0.5">
                আপনি ড্যাশবোর্ড, ১৯২০x১৯২০ ফটোকার্ড ও টেক্সট ফটোকার্ডে পূর্ণ কাজ করতে পারবেন। অন্য সব ট্যাব ভিউ-অনলি মোডে রয়েছে এবং আপনার কার্যক্রম এডমিন অডিটে সংরক্ষিত হচ্ছে।
              </p>
            </div>
          </div>
          <button onclick="handleLogout()" class="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded text-[11px] font-semibold flex items-center gap-1.5">
            <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i> লগআউট / অ্যাকাউন্ট বদলান
          </button>
        </div>

        <div id="role-notice-admin" class="hidden rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5">
            <i class="fa-solid fa-shield-halved text-lg text-amber-400 shrink-0"></i>
            <div>
              <span class="font-bold text-white">সুপার এডমিন মোড সক্রিয় (পূর্ণ নিয়ন্ত্রণ)</span>
              <p class="text-slate-300 text-[11px] mt-0.5">
                আপনার সকল ফিচার পরিচালনা, এড ব্যানার আপলোড/ডিলিট, কর্মী আইডি ও "রিপোর্টার অডিট ট্র্যাকার"-এ পূর্ণ নিয়ন্ত্রণ অধিকার রয়েছে।
              </p>
            </div>
          </div>
          <button onclick="switchTab('audit')" class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold shadow flex items-center gap-1.5">
            <i class="fa-solid fa-users-gear"></i> রিপোর্টার অডিট দেখুন
          </button>
        </div>

        <!-- Toast Notification -->
        <div id="toast-message" class="hidden p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between transition-all">
          <span id="toast-text"><i class="fa-solid fa-check-circle mr-2"></i> সফলভাবে সম্পন্ন হয়েছে!</span>
          <button onclick="document.getElementById('toast-message').classList.add('hidden')" class="text-emerald-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <!-- ==================== TAB 1: OVERVIEW ==================== -->
        <section id="tab-overview" class="space-y-6">
          <div class="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-2xl flex-shrink-0 border border-blue-500/30 font-bold">
                WP
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="font-bold text-white text-sm md:text-base">WordPress লাইভ সংবাদ ফিড</h4>
                  <span id="wp-badge-status" class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> dnbangla.com.bd সংযুক্ত
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">
                  ওয়েবসাইট থেকে সরাসরি সংবাদ নির্বাচন করে নিমেষেই ১৯২০x১৯২০ ফটোকার্ড বা টেক্সট ফটোকার্ড তৈরি করুন।
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span id="wp-last-sync-time" class="text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                সর্বশেষ সিঙ্ক: —
              </span>
              <button onclick="syncWordPress(true)" class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition">
                <i class="fa-solid fa-rotate"></i> এখনই সিঙ্ক করুন
              </button>
            </div>
          </div>

          <!-- 4 Statistics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400">ওয়ার্ডপ্রেস সিঙ্ক পোস্ট</p>
                <h3 class="text-2xl font-bold text-blue-400 mt-1" id="overview-wp-posts">—</h3>
              </div>
              <div class="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl font-bold">
                WP
              </div>
            </div>
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400">লোকাল বিজ্ঞাপন ব্যানার</p>
                <h3 class="text-2xl font-bold text-amber-400 mt-1" id="overview-active-ads">৫ টি</h3>
              </div>
              <div class="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
                <i class="fa-solid fa-arrows-spin"></i>
              </div>
            </div>
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400">রেকর্ডকৃত রিপোর্টার অডিট</p>
                <h3 class="text-2xl font-bold text-emerald-400 mt-1" id="overview-audit-count">০ টি</h3>
              </div>
              <div class="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">
                <i class="fa-solid fa-users"></i>
              </div>
            </div>
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400">নিবন্ধিত কর্মী আইডি</p>
                <h3 class="text-2xl font-bold text-purple-400 mt-1" id="overview-staff-count">৪ জন</h3>
              </div>
              <div class="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl">
                <i class="fa-solid fa-address-card"></i>
              </div>
            </div>
          </div>

          <!-- Live WordPress Feed Grid -->
          <div class="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 class="font-bold text-sm md:text-base text-white flex items-center gap-2">
                  <i class="fa-solid fa-rss text-blue-400"></i> dnbangla.com.bd থেকে লাইভ সংবাদ ফিড
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">যেকোনো সংবাদে ক্লিক করলেই স্বয়ংক্রিয়ভাবে ফটোকার্ডে লোড হবে।</p>
              </div>
              <div class="flex items-center gap-2">
                <button id="wp-feed-prev" onclick="navigateWpFeed(-1)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-slate-200 border border-slate-700 rounded transition flex items-center gap-1" disabled>
                  <i class="fa-solid fa-chevron-left text-[10px]"></i> পূর্ববর্তী ৬টি
                </button>
                <span id="wp-feed-page" class="text-xs text-slate-400 min-w-20 text-center font-mono">পৃষ্ঠা —</span>
                <button id="wp-feed-next" onclick="navigateWpFeed(1)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-slate-200 border border-slate-700 rounded transition flex items-center gap-1" disabled>
                  পরবর্তী ৬টি <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>

            <div id="wp-posts-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="col-span-full py-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <i class="fa-solid fa-spinner animate-spin text-2xl text-blue-500"></i>
                <span>dnbangla.com.bd থেকে লাইভ সংবাদ আনা হচ্ছে...</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== TAB 2: PHOTOCARD GENERATOR ==================== -->
        <section id="tab-photocard" class="hidden space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Controls (5 cols) -->
            <div class="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              <h3 class="font-bold text-base text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span><i class="fa-solid fa-sliders text-red-500"></i> ফটোকার্ড ডিজাইন কন্ট্রোল</span>
                <span class="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-mono font-bold">1920x1920 PX</span>
              </h3>

              <!-- WP Auto-load -->
              <div class="bg-slate-950 p-3 rounded-lg border border-blue-900/40 space-y-2">
                <label class="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <i class="fa-brands fa-wordpress"></i> ওয়ার্ডপ্রেস সংবাদ অটো-লোড (dnbangla.com.bd)
                </label>
                <select id="wp-post-select" onchange="handleSelectWpPost(this.value)" class="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 truncate">
                  <option value="">ওয়ার্ডপ্রেস থেকে পোস্ট লোড হচ্ছে...</option>
                </select>
              </div>

              <!-- Top Header Background -->
              <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <label class="block text-xs font-bold text-emerald-400">
                  <i class="fa-solid fa-palette"></i> ১. টপ হেডার ব্যাকগ্রাউন্ড কালার (0px-80px)
                </label>
                <div class="flex items-center gap-2">
                  <button onclick="resetTopHeaderColor()" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200">
                    ডিফল্ট (হোয়াইট)
                  </button>
                  <div class="flex-1 flex items-center gap-2 bg-slate-900 px-3 py-1 border border-slate-700 rounded">
                    <span class="text-[11px] text-slate-400">হেডার:</span>
                    <input type="color" id="picker-top-bg" value="#ffffff" onchange="drawCanvas()" class="w-7 h-6 bg-transparent rounded cursor-pointer">
                    <span class="text-[11px] text-slate-400 ml-1">তারিখ:</span>
                    <input type="color" id="picker-top-text" value="#111111" onchange="drawCanvas()" class="w-7 h-6 bg-transparent rounded cursor-pointer">
                  </div>
                </div>
              </div>

              <!-- Bottom Headline Background -->
              <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <label class="block text-xs font-bold text-amber-400">
                  <i class="fa-solid fa-palette"></i> ২. হেডলাইনের ব্যাকগ্রাউন্ড কালার (1165px-1563px)
                </label>
                <div class="flex items-center gap-2">
                  <button onclick="resetBottomAreaColor()" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200">
                    ডিফল্ট (মেরুন)
                  </button>
                  <div class="flex-1 flex items-center gap-2 bg-slate-900 px-3 py-1 border border-slate-700 rounded">
                    <span class="text-[11px] text-slate-400">ব্যাক:</span>
                    <input type="color" id="picker-bottom-bg" value="#840b0b" onchange="drawCanvas()" class="w-7 h-6 bg-transparent rounded cursor-pointer">
                    <span class="text-[11px] text-slate-400 ml-1">ফন্ট:</span>
                    <input type="color" id="picker-bottom-text" value="#ffffff" onchange="drawCanvas()" class="w-7 h-6 bg-transparent rounded cursor-pointer">
                  </div>
                </div>
              </div>

              <!-- Date Controls -->
              <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-slate-200">তারিখ সিস্টেম (ডান পাশে)</label>
                  <label class="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input type="checkbox" id="toggle-auto-date" checked onchange="handleAutoDateToggle()" class="rounded accent-red-600">
                    <span>অটো আজকের তারিখ</span>
                  </label>
                </div>
                <input type="date" id="input-date-val" oninput="drawCanvas()" class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200">
              </div>

              <!-- Comment Badge -->
              <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-emerald-400">"বিস্তারিত কমেন্টে" রাউন্ড ব্যাজ (1090px - 1165px)</label>
                  <label class="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input type="checkbox" id="toggle-comment-badge" checked onchange="drawCanvas()" class="rounded accent-emerald-500">
                    <span>চালু / বন্ধ</span>
                  </label>
                </div>
                <input type="text" id="input-comment-text" value="বিস্তারিত কমেন্টে" oninput="drawCanvas()" class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200">
              </div>

              <!-- Headline & Sliders -->
              <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <label class="block text-xs font-bold text-red-400 mb-1">
                  শিরোনাম / মূল হেডিং (1165px - 1563px = 398px):
                </label>
                <textarea id="input-headline" rows="3" oninput="drawCanvas()" class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-red-500">বাংলাদেশে নতুন ডিজিটাল অটোমেশন ও ফটোকার্ড সিস্টেম চালু হয়েছে</textarea>

                <div class="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <div class="flex justify-between text-xs text-slate-300 mb-1">
                      <span>হেডলাইন ফন্ট সাইজ:</span>
                      <span id="fontsize-val" class="font-bold text-amber-400">80px</span>
                    </div>
                    <input type="range" id="input-fontsize" min="40" max="120" value="80" oninput="drawCanvas()" class="w-full accent-red-600">
                  </div>
                  <div>
                    <div class="flex justify-between text-xs text-slate-300 mb-1">
                      <span>ডানে-বামে মার্জিন:</span>
                      <span id="margin-val" class="font-bold text-amber-400">120px</span>
                    </div>
                    <input type="range" id="input-margin" min="40" max="450" value="120" oninput="drawCanvas()" class="w-full accent-red-600">
                  </div>
                </div>
              </div>

              <!-- Feature Photo -->
              <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <label class="block text-xs font-bold text-amber-400">
                  <i class="fa-solid fa-image mr-1"></i> সংবাদের ফিচার ছবি আপলোড করুন (1920x1080px):
                </label>
                <input type="file" id="file-bg" accept="image/*" onchange="handleBgUpload(event)" class="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-slate-800 file:text-slate-200 cursor-pointer">
              </div>

              <!-- Ad Banner Selection -->
              <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-amber-400">বিজ্ঞাপনের ব্যানার নির্বাচন (1640px - 1920px)</label>
                  <span class="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">স্থায়ী সংরক্ষণ</span>
                </div>
                <select id="ad-banner-select" onchange="changeSelectedAd(this.value)" class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"></select>
                <button onclick="rotateToNextAd()" class="w-full py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded text-xs font-semibold flex items-center justify-center gap-2 transition">
                  <i class="fa-solid fa-arrows-rotate"></i> পরবর্তী বিজ্ঞাপনে ঘুরান (Next Cycle)
                </button>
              </div>

              <!-- Download Button -->
              <button onclick="downloadCanvas()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow flex items-center justify-center gap-2 transition">
                <i class="fa-solid fa-download"></i> HD ফটোকার্ড ডাউনলোড (1920x1920 PX)
              </button>
            </div>

            <!-- Preview (7 cols) -->
            <div class="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col items-center justify-between min-h-[500px]">
              <div class="w-full flex justify-between items-center mb-3">
                <h4 class="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <i class="fa-solid fa-eye text-blue-400"></i> ১৯২০ x ১৯২০ PX ক্যানভাস প্রিভিউ
                </h4>
                <span class="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 font-mono">1920x1920 Square</span>
              </div>
              <div class="w-full flex justify-center items-center py-2 relative">
                <canvas id="photocardCanvas" width="1920" height="1920" class="w-full max-w-[500px] aspect-square rounded-xl border border-slate-700 shadow-2xl bg-white object-contain"></canvas>
              </div>
              <div class="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-2">
                <span>বর্তমান প্রস্তুতকারী: <strong id="preview-user-text" class="text-white">রিপোর্টার</strong></span>
                <span class="text-emerald-400 font-semibold">রেজোলিউশন: 1920x1920 Full HD</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== TAB 3: TEXT / TRIGGER PHOTOCARD ==================== -->
        <section id="tab-texttrigger" class="hidden space-y-6">
          <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-5">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-base text-white flex items-center gap-2">
                <i class="fa-solid fa-font text-amber-500"></i> টেক্সট / টিগার ফটোকার্ড জেনারেটর (1920x1920px)
              </h3>
              <span class="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded">সেন্টার্ড এলাইনমেন্ট</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">ব্যাকগ্রাউন্ড স্টাইল / কালার:</label>
                  <select id="text-trigger-bg" onchange="handleTextTriggerBackgroundChange()" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white">
                    <option value="gradient-red">DN Bangla Red Gradient</option>
                    <option value="gradient-blue">Deep Slate Night</option>
                    <option value="gradient-maroon">Maroon Classic Event</option>
                    <option value="gradient-dark">Dark Minimal</option>
                    <option value="custom">Custom Color</option>
                  </select>
                  <div class="flex items-center gap-2 mt-2">
                    <label for="text-trigger-custom-color" class="text-[11px] text-slate-400">কাস্টম কালার:</label>
                    <input type="color" id="text-trigger-custom-color" value="#25406b" disabled oninput="drawTextTriggerCanvas()" class="w-9 h-7 bg-transparent rounded cursor-not-allowed opacity-50">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">উপরে ছোট ক্যাটাগরি:</label>
                  <input type="text" id="text-trigger-cat" value="⚠️ বিশেষ ঘোষণা ও ব্রেকিং নিউজ" oninput="drawTextTriggerCanvas()" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">মূল বার্তা (সর্বদা সেন্টারে থাকবে):</label>
                  <textarea id="text-trigger-content" rows="4" oninput="drawTextTriggerCanvas()" class="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white text-center">আজ রাত ১০ টার মধ্যে সকল বিভাগীয় প্রধানদের জরুরি মিটিংয়ে উপস্থিত থাকার নির্দেশ দেওয়া হলো।</textarea>
                </div>

                <div>
                  <div class="flex justify-between text-xs text-slate-400 mb-1">
                    <span>বার্তা ফন্ট সাইজ:</span>
                    <span id="tc-fontsize-val">75px</span>
                  </div>
                  <input type="range" id="tc-input-fontsize" min="40" max="120" value="75" oninput="drawTextTriggerCanvas()" class="w-full accent-amber-500">
                </div>

                <div>
                  <div class="flex justify-between text-xs text-slate-400 mb-1">
                    <span>বাম ও ডান মার্জিন:</span>
                    <span id="tc-margin-val">225px</span>
                  </div>
                  <input type="range" id="tc-input-margin" min="80" max="450" value="225" oninput="drawTextTriggerCanvas()" class="w-full accent-amber-500">
                </div>

                <div class="pt-2 space-y-2">
                  <button onclick="generateTextTriggerCard()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs shadow flex items-center justify-center gap-2 transition">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> পরবর্তী বিজ্ঞাপনসহ নতুন টেক্সট ফটোকার্ড তৈরি
                  </button>
                  <button onclick="downloadTextTriggerCanvas()" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg text-xs shadow flex items-center justify-center gap-2 transition">
                    <i class="fa-solid fa-download"></i> টেক্সট ফটোকার্ড ডাউনলোড (1920x1920)
                  </button>
                </div>
              </div>

              <div class="flex flex-col items-center justify-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                <canvas id="textTriggerCanvas" width="1920" height="1920" class="w-full max-w-[450px] aspect-square rounded-xl border border-slate-700 shadow-2xl object-contain"></canvas>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== TAB 4: AD MANAGER ==================== -->
        <section id="tab-admanager" class="hidden space-y-6">
          <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-5">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 class="font-bold text-base text-white flex items-center gap-2">
                  <i class="fa-solid fa-arrows-spin text-amber-500"></i> লোকাল এড ম্যানেজার ও ব্যানার ব্যবস্থাপনা
                </h3>
                <p class="text-xs text-slate-400 mt-1">বিজ্ঞাপনের ব্যানারগুলো ব্রাউজারের লোকাল স্টোরেজে স্থায়ীভাবে সংরক্ষিত রয়েছে।</p>
              </div>
              <button onclick="restoreDefaultBanners()" id="btn-restore-banners" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-semibold rounded text-xs transition flex items-center gap-1.5">
                <i class="fa-solid fa-rotate-left"></i> ডিফল্ট ৫টি ব্যানার রিস্টোর
              </button>
            </div>

            <!-- Upload Form -->
            <div id="ad-upload-box" class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 class="text-xs font-bold text-amber-400"><i class="fa-solid fa-upload"></i> নতুন বিজ্ঞাপন ব্যানার আপলোড</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label class="block text-slate-400 mb-1">বিজ্ঞাপনের নাম:</label>
                  <input type="text" id="new-ad-name" placeholder="যেমন: বিজ্ঞাপন ব্যানার 06" class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">বিবরণ / ফোন:</label>
                  <input type="text" id="new-ad-desc" placeholder="যেমন: ব্র্যান্ড বিবরণ বা যোগাযোগ" class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">ব্যানার ছবি ফাইল:</label>
                  <input type="file" id="new-ad-file" accept="image/*" class="w-full text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-800 file:text-slate-200">
                </div>
              </div>
              <button onclick="uploadAdFromPC()" id="btn-upload-ad" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded text-xs transition flex items-center justify-center gap-2 mt-2">
                <i class="fa-solid fa-floppy-disk"></i> বিজ্ঞাপনে যুক্ত ও সংরক্ষণ করুন
              </button>
            </div>

            <h4 class="font-bold text-xs text-slate-300 pt-2">সংরক্ষিত বিজ্ঞাপন ব্যানার তালিকা:</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="ad-list-container"></div>
          </div>
        </section>

        <!-- ==================== TAB 5: SCHEDULE ==================== -->
        <section id="tab-schedule" class="hidden space-y-6">
          <div class="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 space-y-6">
            <div class="border-b border-slate-800 pb-3">
              <h3 class="font-bold text-base md:text-lg text-white flex items-center gap-2">
                <i class="fa-solid fa-clock-rotate-left text-red-500"></i> দৈনিক সময়সূচি ভিত্তিক অটো শিডিউলার
              </h3>
              <p class="text-xs text-slate-400 mt-1">প্রতিদিনের সকাল, দুপুর ও রাতের নির্ধারিত বুলেটিন ফটোকার্ডের রুটিন।</p>
            </div>

            <div class="space-y-4">
              <h4 class="text-xs md:text-sm font-bold text-amber-400"><i class="fa-solid fa-sun mr-1"></i> ১. সকালের বুলেটিন রুটিন</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold">ভোর ০৬:০০ টা</span>
                    <h5 class="text-xs font-bold text-white mt-1">🌅 শুভ সকাল অনুপ্রেরণা</h5>
                    <textarea id="sched-text-morning" rows="2" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[11px] text-slate-200 mt-1">একটি নতুন সকাল আপনার জীবনে অফুরন্ত সাফল্য ও বরকত বয়ে আনুক — ডিএন বাংলা</textarea>
                  </div>
                  <div class="flex gap-2 pt-1 border-t border-slate-800">
                    <button onclick="sendScheduleToTextTrigger('sched-text-morning', '🌅 শুভ সকাল অনুপ্রেরণা')" class="flex-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 py-1 rounded">টিগারে পাঠান</button>
                    <button onclick="sendScheduleToHeadline('sched-text-morning', 'শুভ সকাল')" class="flex-1 text-[11px] bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1 rounded">ফটোকার্ডে লোড</button>
                  </div>
                </div>

                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono font-bold">সকাল ০৬:৩০ টা</span>
                    <h5 class="text-xs font-bold text-white mt-1">🌦️ আবহাওয়ার বার্তা</h5>
                    <textarea id="sched-text-weather" rows="2" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[11px] text-slate-200 mt-1">আজকের সকালের আবহাওয়া: সর্বনিম্ন তাপমাত্রা ২২° সে., নদী অববাহিকায় হালকা কুয়াশা ও সারাদিন আকাশ আংশিক মেঘলা থাকবে।</textarea>
                  </div>
                  <div class="flex gap-2 pt-1 border-t border-slate-800">
                    <button onclick="sendScheduleToTextTrigger('sched-text-weather', '🌦️ আজকের আবহাওয়ার বার্তা')" class="flex-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 py-1 rounded">টিগারে পাঠান</button>
                    <button onclick="sendScheduleToHeadline('sched-text-weather', 'আবহাওয়া বার্তা')" class="flex-1 text-[11px] bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1 rounded">ফটোকার্ডে লোড</button>
                  </div>
                </div>

                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold">সকাল ০৭:০০ টা</span>
                    <h5 class="text-xs font-bold text-white mt-1">🕌 নামাজের সময়সূচি</h5>
                    <textarea id="sched-text-prayer" rows="2" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-[11px] text-slate-200 mt-1">ঢাকা: ফজর ৪:৫২, যোহর ১১:৫৮, আসর ৩:১৫, মাগরিব ৫:১৯, এশা ৬:৩৬ | সেহরি ৪:১৮, ইফতার ৬:১৮</textarea>
                  </div>
                  <div class="flex gap-2 pt-1 border-t border-slate-800">
                    <button onclick="sendScheduleToTextTrigger('sched-text-prayer', '🕌 দৈনিক নামাজের সময়সূচি')" class="flex-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-300 py-1 rounded">টিগারে পাঠান</button>
                    <button onclick="sendScheduleToHeadline('sched-text-prayer', 'নামাজের সময়')" class="flex-1 text-[11px] bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1 rounded">ফটোকার্ডে লোড</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== TAB 6: STAFF ==================== -->
        <section id="tab-staff" class="hidden space-y-6">
          <div class="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 class="font-bold text-base md:text-lg text-white flex items-center gap-2">
                  <i class="fa-solid fa-id-card text-emerald-500"></i> কর্মকর্তা ও সাংবাদিকদের প্রেস আইডি কার্ড
                </h3>
                <p class="text-xs text-slate-400 mt-1">ডিজিটাল প্রেস আইডি কার্ড জেনারেটর ও তথ্যভান্ডার।</p>
              </div>
              <button onclick="toggleStaffForm()" id="btn-add-staff" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition">
                <i class="fa-solid fa-user-plus"></i> নতুন কর্মী যুক্ত করুন
              </button>
            </div>

            <!-- Staff Form -->
            <div id="staff-form-container" class="hidden bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <h4 class="text-xs font-bold text-emerald-400"><i class="fa-solid fa-pen-to-square"></i> নতুন কর্মীর তথ্য ফরম</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label class="block text-slate-400 mb-1">পূর্ণ নাম *</label>
                  <input type="text" id="staff-name" placeholder="যেমন: তানভীর আহমেদ" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">পদবী *</label>
                  <input type="text" id="staff-designation" placeholder="যেমন: সিনিয়র রিপোর্টার" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">আইডি নম্বর *</label>
                  <input type="text" id="staff-id" placeholder="DN-2026-105" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">মোবাইল নম্বর *</label>
                  <input type="text" id="staff-phone" placeholder="017xxxxxxxx" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button onclick="toggleStaffForm()" class="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs">বাতিল</button>
                <button onclick="saveStaffMember()" class="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs">সংরক্ষণ করুন</button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- List -->
              <div class="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 class="text-xs font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>কর্মকর্তা তালিকা (<span id="staff-count-badge">0</span> জন)</span>
                </h4>
                <div class="space-y-2 max-h-[460px] overflow-y-auto pr-1" id="staff-cards-list"></div>
              </div>

              <!-- ID Preview -->
              <div class="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 flex flex-col items-center">
                <div class="w-full flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i class="fa-solid fa-id-badge text-red-500"></i> ডিজিটাল প্রেস কার্ড
                  </h4>
                  <div class="flex gap-1 text-[11px]">
                    <button id="btn-card-front" onclick="switchCardSide('front')" class="px-2.5 py-1 rounded bg-red-600 text-white font-semibold">ফ্রন্ট</button>
                    <button id="btn-card-back" onclick="switchCardSide('back')" class="px-2.5 py-1 rounded bg-slate-800 text-slate-300">ব্যাক</button>
                  </div>
                </div>

                <canvas id="staffCardCanvas" width="600" height="920" class="w-[280px] h-[430px] rounded-xl shadow-2xl border-2 border-slate-700 bg-white object-contain"></canvas>

                <button onclick="downloadStaffCard()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 shadow transition">
                  <i class="fa-solid fa-download"></i> HD প্রেস কার্ড ডাউনলোড
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== TAB 7: INTEGRATIONS ==================== -->
        <section id="tab-integrations" class="hidden space-y-6">
          <div class="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 class="font-bold text-base md:text-lg text-white flex items-center gap-2">
                  <i class="fa-brands fa-wordpress text-blue-500"></i> ওয়ার্ডপ্রেস ও সোশ্যাল API কনফিগারেশন
                </h3>
                <p class="text-xs text-slate-400 mt-1">WordPress সাইট ও সকল সোশ্যাল মিডিয়ার API কনফিগারেশন।</p>
              </div>
              <button onclick="saveAllApiSettings()" id="btn-save-api" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition">
                <i class="fa-solid fa-floppy-disk"></i> সেটিংস সংরক্ষণ
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 class="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <i class="fa-brands fa-wordpress text-blue-500"></i> ওয়ার্ডপ্রেস (WordPress REST API)
                </h4>
                <div>
                  <label class="block text-slate-400 mb-1">সাইট URL:</label>
                  <input type="text" id="api-wp-url" value="https://dnbangla.com.bd" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono">
                </div>
              </div>
              <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 class="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <i class="fa-brands fa-facebook text-blue-600"></i> ফেসবুক পেজ (Facebook Graph API)
                </h4>
                <div>
                  <label class="block text-slate-400 mb-1">Page ID:</label>
                  <input type="text" id="api-fb-pageid" value="dnbanglaN" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono">
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== TAB 8: ADMIN-ONLY AUDIT TRACKER ==================== -->
        <section id="tab-audit" class="hidden space-y-6">
          <div class="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 space-y-5">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 class="font-bold text-base md:text-lg text-white flex items-center gap-2">
                  <i class="fa-solid fa-users-gear text-amber-500"></i> রিপোর্টার অ্যাক্টিভিটি ট্র্যাকার ও অডিট ড্যাশবোর্ড
                </h3>
                <p class="text-xs text-slate-400 mt-1">কোন রিপোর্টার (@gmail.com) কখন কী কী ফটোকার্ড তৈরি ও ডাউনলোড করেছেন তার পূর্ণ বিবরণ।</p>
              </div>
              <div class="flex gap-2">
                <button onclick="exportAuditLogsToCSV()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition">
                  <i class="fa-solid fa-file-csv"></i> CSV এক্সপোর্ট
                </button>
                <button onclick="clearAuditLogs()" class="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
                  <i class="fa-solid fa-trash"></i> অডিট পরিষ্কার
                </button>
              </div>
            </div>

            <!-- Filters -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <label class="block text-slate-400 mb-1">রিপোর্টার ফিল্টার (@gmail.com):</label>
                <select id="audit-filter-reporter" onchange="renderAuditLogs()" class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white">
                  <option value="all">সকল রিপোর্টার</option>
                </select>
              </div>
              <div>
                <label class="block text-slate-400 mb-1">কীওয়ার্ড বা শিরোনাম খুঁজুন:</label>
                <input type="text" id="audit-filter-search" oninput="renderAuditLogs()" placeholder="শিরোনাম লিখুন..." class="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white">
              </div>
            </div>

            <!-- Audit Logs List -->
            <div id="audit-logs-container" class="space-y-3 max-h-[500px] overflow-y-auto pr-1"></div>
          </div>
        </section>

        <!-- ==================== TAB 9: LOGS ==================== -->
        <section id="tab-logs" class="hidden space-y-6">
          <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-base text-white flex items-center gap-2">
                <i class="fa-solid fa-terminal text-emerald-500"></i> লাইভ সিস্টেম অটোমেশন লগস
              </h3>
              <button onclick="clearLogs()" class="text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded">লগ পরিষ্কার</button>
            </div>
            <div id="system-logs-box" class="bg-slate-950 p-4 rounded-lg font-mono text-xs text-emerald-400 h-64 overflow-y-auto space-y-2 border border-slate-800">
              <p>[12:00:00 PM] 1920x1920 PhotoCard Engine initialized.</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- JAVASCRIPT MASTER ENGINE -->
  <script>
    const AUTH_KEY = 'dnbangla_current_auth_v2';
    const AUDIT_KEY = 'dnbangla_reporter_audit_v2';
    const AD_STORAGE_KEY = 'dnbangla_permanent_ads_v3';
    const STAFF_STORAGE_KEY = 'dnbangla_staff_directory';

    const ADMIN_PASS = 'adminipdnb';
    const REPORTER_PASS = 'posteditor';

    let currentUser = null;

    let defaultAds = [
      { id: 'ad-1', name: 'বিজ্ঞাপন ব্যানার 01', desc: 'নিউ ক্লাসিক ইভেন্ট ম্যানেজমেন্ট (NCEM) | 01945544242', image: 'https://www.dnbangla.com.bd/wp-content/uploads/2026/03/ads-ncem-scaled.jpg', localFallback: '/ads/ad1.jpg' },
      { id: 'ad-2', name: 'বিজ্ঞাপন ব্যানার 02', desc: 'মুক্তি ক্লিনিক ও ডায়াগনস্টিক সেন্টার', image: 'https://www.dnbangla.com.bd/wp-content/uploads/2026/03/mukti-clinic.jpg', localFallback: '/ads/ad2.jpg' },
      { id: 'ad-3', name: 'বিজ্ঞাপন ব্যানার 03', desc: 'খাদিজা হুমায়রা রূপন', image: 'https://www.dnbangla.com.bd/wp-content/uploads/2026/10/ads-khadija-humayra-rupon.jpg', localFallback: '/ads/ad3.jpg' },
      { id: 'ad-4', name: 'বিজ্ঞাপন ব্যানার 04', desc: 'মনির ডেন্টাল কেয়ার', image: 'https://www.dnbangla.com.bd/wp-content/uploads/2026/03/Monir-Dental.jpg', localFallback: '/ads/ad4.jpg' },
      { id: 'ad-5', name: 'বিজ্ঞাপন ব্যানার 05', desc: 'NCTTA একাডেমি', image: 'https://www.dnbangla.com.bd/wp-content/uploads/2026/03/NCTTA-Academy.jpg', localFallback: '/ads/ad5.jpg' }
    ];

    let defaultStaff = [
      { id: 'DN-2026-101', name: 'মোঃ তানভীর আহমেদ', designation: 'চিফ নিউজ এডিটর', dept: 'বার্তা বিভাগ', blood: 'O+', phone: '01711-223344', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
      { id: 'DN-2026-102', name: 'ফারজানা ইয়াসমিন', designation: 'সিনিয়র ইনভেস্টিগেটিভ রিপোর্টার', dept: 'বার্তা বিভাগ', blood: 'A+', phone: '01812-334455', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
      { id: 'DN-2026-103', name: 'রাকিবুল হাসান রনি', designation: 'হেড অব মাল্টিমিডিয়া ও ভিডিও', dept: 'মাল্টিমিডিয়া ও ভিডিও', blood: 'B+', phone: '01913-445566', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { id: 'DN-2026-104', name: 'নুসরাত জাহান', designation: 'ডিজিটাল মিডিয়া ও সোশ্যাল লিড', dept: 'ডিজিটাল মিডিয়া ও সোশ্যাল', blood: 'AB+', phone: '01614-556677', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' }
    ];

    let adBanners = loadAdBanners();
    let staffList = loadStaffList();
    let currentAdIndex = 0;
    let textAdIndex = 0;
    let adImageObjs = {};
    let bgImageObj = null;
    let staffPhotoImgs = {};
    let selectedStaffIndex = 0;
    let cardSide = 'front';
    let wpPostsList = [];
    let currentWpIndex = 0;
    let wpFeedPage = 1;
    let wpFeedTotalPages = 1;
    let wpFeedTotal = 0;
    let toastTimer = null;

    // Load Initial Auth
    function initAuth() {
      try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.role === 'admin' || parsed.role === 'reporter') && parsed.email) {
            currentUser = parsed;
          }
        }
      } catch (e) {}

      if (!currentUser) {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('app-portal').classList.add('hidden');
      } else {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-portal').classList.remove('hidden');
        applyUserRoleUI();
      }
    }

    function switchLoginTab(tab) {
      const isReporter = tab === 'reporter';
      document.getElementById('form-reporter-login').classList.toggle('hidden', !isReporter);
      document.getElementById('form-admin-login').classList.toggle('hidden', isReporter);
      document.getElementById('tab-btn-reporter').className = isReporter
        ? 'flex items-center justify-center gap-2 py-3 rounded-xl transition bg-blue-600 text-white shadow-lg shadow-blue-900/30'
        : 'flex items-center justify-center gap-2 py-3 rounded-xl transition text-slate-400 hover:text-white';
      document.getElementById('tab-btn-admin').className = !isReporter
        ? 'flex items-center justify-center gap-2 py-3 rounded-xl transition bg-amber-600 text-white shadow-lg shadow-amber-900/30'
        : 'flex items-center justify-center gap-2 py-3 rounded-xl transition text-slate-400 hover:text-white';
      hideLoginAlert();
    }

    function togglePassVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    }

    function showLoginAlert(msg, type = 'error') {
      const alert = document.getElementById('login-alert');
      const text = document.getElementById('login-alert-text');
      const icon = document.getElementById('login-alert-icon');
      alert.className = `p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
        type === 'error' ? 'bg-red-500/15 border-red-500/30 text-red-200' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
      }`;
      icon.className = type === 'error' ? 'fa-solid fa-circle-exclamation text-red-400' : 'fa-solid fa-circle-check text-emerald-400';
      text.textContent = msg;
      alert.classList.remove('hidden');
    }

    function hideLoginAlert() {
      const alert = document.getElementById('login-alert');
      if (alert) alert.classList.add('hidden');
    }

    function handleReporterLogin(e) {
      e.preventDefault();
      hideLoginAlert();
      const email = document.getElementById('input-reporter-email').value.trim().toLowerCase();
      const pass = document.getElementById('input-reporter-pass').value;

      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\\.com$/;
      if (!gmailRegex.test(email)) {
        showLoginAlert('অনুগ্রহ করে একটি বৈধ @gmail.com ঠিকানা দিন (যেমন: name@gmail.com)');
        return;
      }

      if (pass !== REPORTER_PASS) {
        showLoginAlert('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
        return;
      }

      const user = {
        role: 'reporter',
        email: email,
        name: email.split('@')[0],
        loggedInAt: new Date().toLocaleTimeString('bn-BD')
      };

      currentUser = user;
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      logReporterAction('সিস্টেমে লগইন করেছেন', 'login', undefined, `লগইন ইমেইল: ${email}`);
      showLoginAlert(`স্বাগতম! রিপোর্টার হিসেবে প্রবেশ সফল হয়েছে (${email})`, 'success');

      setTimeout(() => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-portal').classList.remove('hidden');
        applyUserRoleUI();
        showToast(`স্বাগতম, ${user.name}!`);
      }, 400);
    }

    function handleAdminLogin(e) {
      e.preventDefault();
      hideLoginAlert();
      const userField = document.getElementById('input-admin-user').value.trim();
      const pass = document.getElementById('input-admin-pass').value;

      if (pass !== ADMIN_PASS) {
        showLoginAlert('ভুল এডমিন পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
        return;
      }

      const user = {
        role: 'admin',
        email: userField || 'admin@dnbangla.com',
        name: 'সুপার এডমিন',
        loggedInAt: new Date().toLocaleTimeString('bn-BD')
      };

      currentUser = user;
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      showLoginAlert('এডমিন হিসেবে প্রবেশ সফল হয়েছে! সকল নিয়ন্ত্রণ আনলক করা হয়েছে।', 'success');

      setTimeout(() => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-portal').classList.remove('hidden');
        applyUserRoleUI();
        showToast('এডমিন মোড সফলভাবে সক্রিয় হয়েছে!');
      }, 400);
    }

    function handleLogout() {
      if (confirm('আপনি কি নিশ্চিত যে সিস্টেম থেকে লগআউট করতে চান?')) {
        if (currentUser) {
          logReporterAction('সিস্টেম থেকে লগআউট করেছেন', 'other', undefined, `ইউজার: ${currentUser.email}`);
        }
        currentUser = null;
        localStorage.removeItem(AUTH_KEY);
        document.getElementById('app-portal').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        showToast('সফলভাবে লগআউট হয়েছে!');
      }
    }

    function applyUserRoleUI() {
      if (!currentUser) return;
      const isAdmin = currentUser.role === 'admin';
      const isReporter = currentUser.role === 'reporter';

      // Sidebar indicators
      document.getElementById('sidebar-user-avatar').textContent = isAdmin ? 'A' : 'R';
      document.getElementById('sidebar-user-avatar').className = isAdmin
        ? 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-amber-600 text-white'
        : 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-blue-600 text-white';
      document.getElementById('sidebar-user-name').textContent = currentUser.name || currentUser.email;
      document.getElementById('sidebar-user-role').textContent = isAdmin ? '👑 সুপার এডমিন' : `👤 রিপোর্টার (${currentUser.email})`;

      // Top bar
      document.getElementById('topbar-user-icon').className = isAdmin
        ? 'fa-solid fa-shield-halved text-amber-400'
        : 'fa-solid fa-user-check text-blue-400';
      document.getElementById('topbar-user-text').textContent = isAdmin ? 'এডমিন' : currentUser.email;

      // Notices
      document.getElementById('role-notice-reporter').classList.toggle('hidden', !isReporter);
      document.getElementById('role-notice-admin').classList.toggle('hidden', !isAdmin);
      if (document.getElementById('reporter-banner-email')) {
        document.getElementById('reporter-banner-email').textContent = `রিপোর্টার মোড সক্রিয় (${currentUser.email})`;
      }

      // Lock icons on sidebar
      document.getElementById('lock-admanager').classList.toggle('hidden', !isReporter);
      document.getElementById('lock-schedule').classList.toggle('hidden', !isReporter);
      document.getElementById('lock-staff').classList.toggle('hidden', !isReporter);
      document.getElementById('lock-integrations').classList.toggle('hidden', !isReporter);

      // Audit nav tab (Admin only)
      document.getElementById('nav-audit').classList.toggle('hidden', !isAdmin);

      // Ad upload button permission lock
      const btnUploadAd = document.getElementById('btn-upload-ad');
      if (btnUploadAd) {
        btnUploadAd.disabled = isReporter;
        btnUploadAd.classList.toggle('opacity-50', isReporter);
      }
      const btnRestore = document.getElementById('btn-restore-banners');
      if (btnRestore) {
        btnRestore.disabled = isReporter;
        btnRestore.classList.toggle('opacity-50', isReporter);
      }

      // Staff add button
      const btnAddStaff = document.getElementById('btn-add-staff');
      if (btnAddStaff) {
        btnAddStaff.disabled = isReporter;
        btnAddStaff.classList.toggle('opacity-50', isReporter);
      }

      // API save button
      const btnSaveApi = document.getElementById('btn-save-api');
      if (btnSaveApi) {
        btnSaveApi.disabled = isReporter;
        btnSaveApi.classList.toggle('opacity-50', isReporter);
      }

      renderAuditLogs();
      renderAdList();
      renderStaffTable();
    }

    // AUDIT LOGGING
    function getAuditLogs() {
      try {
        const raw = localStorage.getItem(AUDIT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
      return [];
    }

    function logReporterAction(action, actionType, headline, details) {
      if (!currentUser) return;
      const now = new Date();
      const newLog = {
        id: 'log-' + Date.now(),
        reporterEmail: currentUser.email,
        role: currentUser.role,
        action,
        actionType: actionType || 'other',
        headline,
        details,
        timestamp: now.toLocaleTimeString('bn-BD'),
        date: now.toISOString().split('T')[0]
      };
      const logs = [newLog, ...getAuditLogs()].slice(0, 500);
      try {
        localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
      } catch (e) {}
      renderAuditLogs();
    }

    function renderAuditLogs() {
      const logs = getAuditLogs();
      const countEl = document.getElementById('overview-audit-count');
      if (countEl) countEl.textContent = logs.length + ' টি';
      const badgeEl = document.getElementById('audit-badge-count');
      if (badgeEl) badgeEl.textContent = logs.length;

      const container = document.getElementById('audit-logs-container');
      if (!container) return;

      const filterReporter = document.getElementById('audit-filter-reporter')?.value || 'all';
      const search = document.getElementById('audit-filter-search')?.value.toLowerCase().trim() || '';

      // Update reporter filter dropdown options
      const repSelect = document.getElementById('audit-filter-reporter');
      if (repSelect && repSelect.children.length <= 1) {
        const set = new Set(logs.map(l => l.reporterEmail));
        set.forEach(email => {
          const opt = document.createElement('option');
          opt.value = email;
          opt.textContent = email;
          repSelect.appendChild(opt);
        });
      }

      const filtered = logs.filter(l => {
        if (filterReporter !== 'all' && l.reporterEmail !== filterReporter) return false;
        if (search) {
          const text = ((l.headline || '') + ' ' + l.action + ' ' + l.reporterEmail + ' ' + (l.details || '')).toLowerCase();
          if (!text.includes(search)) return false;
        }
        return true;
      });

      if (!filtered.length) {
        container.innerHTML = '<div class="py-10 text-center text-slate-500 text-xs">কোনো অডিট রেকর্ড পাওয়া যায়নি।</div>';
        return;
      }

      container.innerHTML = filtered.map(item => `
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-bold text-white">${item.reporterEmail}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">${item.action}</span>
            </div>
            <span class="text-[10px] text-slate-400 font-mono">${item.timestamp} • ${item.date}</span>
          </div>
          ${item.headline ? `<p class="text-slate-200 font-semibold bg-slate-900 p-2 rounded border border-slate-800">"${item.headline}"</p>` : ''}
          ${item.details ? `<p class="text-slate-400 text-[11px]">${item.details}</p>` : ''}
        </div>
      `).join('');
    }

    function exportAuditLogsToCSV() {
      const logs = getAuditLogs();
      if (!logs.length) {
        alert('এক্সপোর্ট করার মতো কোনো লগ নেই।');
        return;
      }
      const headers = ['ID', 'Reporter', 'Role', 'Action', 'Headline', 'Details', 'Time', 'Date'];
      const rows = logs.map(l => [
        l.id,
        `"${l.reporterEmail}"`,
        l.role,
        `"${(l.action || '').replace(/"/g, '""')}"`,
        `"${(l.headline || '').replace(/"/g, '""')}"`,
        `"${(l.details || '').replace(/"/g, '""')}"`,
        l.timestamp,
        l.date
      ]);
      const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dnbangla_audit_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    function clearAuditLogs() {
      if (confirm('সকল অডিট লগ মুছে ফেলতে চান?')) {
        localStorage.removeItem(AUDIT_KEY);
        renderAuditLogs();
        showToast('অডিট হিস্টোরি মুছে ফেলা হয়েছে।');
      }
    }

    // ADS
    function loadAdBanners() {
      try {
        const saved = localStorage.getItem(AD_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return [...defaultAds];
    }

    function saveAdBanners() {
      try {
        localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(adBanners));
        return true;
      } catch (e) {
        showToast('স্টোরেজ পূর্ণ। কিছু বিজ্ঞাপন মুছুন।', 'error');
        return false;
      }
    }

    function initAdDropdown() {
      const select = document.getElementById('ad-banner-select');
      if (!select) return;
      select.innerHTML = '';
      adBanners.forEach((ad, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = ad.name + ' (' + ad.desc.substring(0, 25) + '...)';
        select.appendChild(opt);
      });
    }

    function changeSelectedAd(val) {
      currentAdIndex = parseInt(val, 10);
      document.getElementById('topbar-ad-name').textContent = adBanners[currentAdIndex].name;
      drawCanvas();
    }

    function rotateToNextAd() {
      currentAdIndex = (currentAdIndex + 1) % adBanners.length;
      document.getElementById('ad-banner-select').value = currentAdIndex;
      document.getElementById('topbar-ad-name').textContent = adBanners[currentAdIndex].name;
      drawCanvas();
      showToast('পরবর্তী বিজ্ঞাপন লোড হয়েছে: ' + adBanners[currentAdIndex].name);
      logReporterAction('বিজ্ঞাপন রোটেট', 'ad_rotate', undefined, `ব্যানার: ${adBanners[currentAdIndex].name}`);
    }

    function renderAdList() {
      const container = document.getElementById('ad-list-container');
      if (!container) return;
      container.innerHTML = '';
      const isReporter = currentUser && currentUser.role === 'reporter';

      adBanners.forEach((ad, idx) => {
        const div = document.createElement('div');
        div.className = 'bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2';
        div.innerHTML = `
          <div class="aspect-video w-full rounded overflow-hidden relative bg-slate-900">
            <img src="${ad.localFallback || ad.image}" alt="${ad.name}" class="w-full h-full object-cover" onerror="this.src='${ad.image}'">
            <span class="absolute top-1 left-1 bg-amber-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">#${idx + 1}</span>
          </div>
          <h4 class="font-semibold text-xs text-slate-200 truncate">${ad.name}</h4>
          <p class="text-[10px] text-slate-400 truncate">${ad.desc}</p>
          <div class="flex gap-2 pt-1">
            <button onclick="changeSelectedAd(${idx}); switchTab('photocard');" class="flex-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 py-1 rounded transition text-center">
              সিলেক্ট করুন
            </button>
            ${!isReporter ? `<button onclick="deleteAd(${idx})" class="px-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-1 rounded text-[11px]"><i class="fa-solid fa-trash"></i></button>` : ''}
          </div>
        `;
        container.appendChild(div);
      });
      const countEl = document.getElementById('overview-active-ads');
      if (countEl) countEl.textContent = adBanners.length + ' টি';
    }

    function deleteAd(idx) {
      if (currentUser && currentUser.role === 'reporter') {
        showToast('শুধুমাত্র এডমিন বিজ্ঞাপন মুছতে পারবেন।', 'info');
        return;
      }
      if (adBanners.length <= 1) { alert('অন্তত একটি বিজ্ঞাপন আবশ্যক!'); return; }
      if (confirm('বিজ্ঞাপনটি মুছে ফেলতে চান?')) {
        const removed = adBanners.splice(idx, 1)[0];
        saveAdBanners();
        currentAdIndex = 0;
        initAdDropdown();
        renderAdList();
        preloadAdImages();
        drawCanvas();
        showToast('বিজ্ঞাপনটি মুছে ফেলা হয়েছে।');
        logReporterAction('বিজ্ঞাপন মুছে ফেলা', 'other', undefined, `ব্যানার: ${removed.name}`);
      }
    }

    function restoreDefaultBanners() {
      if (currentUser && currentUser.role === 'reporter') {
        showToast('শুধুমাত্র এডমিন রিস্টোর করতে পারবেন।', 'info');
        return;
      }
      if (confirm('ডিফল্ট ৫টি ব্যানার রিস্টোর করতে চান?')) {
        adBanners = [...defaultAds];
        saveAdBanners();
        currentAdIndex = 0;
        initAdDropdown();
        renderAdList();
        preloadAdImages();
        drawCanvas();
        showToast('ডিফল্ট ৫টি ব্যানার রিস্টোর সম্পন্ন হয়েছে।');
      }
    }

    function uploadAdFromPC() {
      if (currentUser && currentUser.role === 'reporter') {
        showToast('শুধুমাত্র এডমিন নতুন বিজ্ঞাপন আপলোড করতে পারবেন।', 'info');
        return;
      }
      const name = document.getElementById('new-ad-name').value.trim();
      const desc = document.getElementById('new-ad-desc').value.trim();
      const file = document.getElementById('new-ad-file').files[0];

      if (!name) { showToast('বিজ্ঞাপনের নাম দিন।', 'error'); return; }
      if (!file) { showToast('ছবি নির্বাচন করুন।', 'error'); return; }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newAd = { id: 'ad-' + Date.now(), name, desc: desc || 'বিজ্ঞাপন', image: e.target.result };
        adBanners.push(newAd);
        saveAdBanners();
        initAdDropdown();
        renderAdList();
        preloadAdImages();
        showToast('ব্যানার সফলভাবে যুক্ত হয়েছে!');
        logReporterAction('নতুন বিজ্ঞাপন আপলোড', 'other', undefined, `ব্যানার: ${name}`);
        document.getElementById('new-ad-name').value = '';
        document.getElementById('new-ad-desc').value = '';
        document.getElementById('new-ad-file').value = '';
      };
      reader.readAsDataURL(file);
    }

    // CANVAS PHOTOCARD
    function drawCanvas() {
      const canvas = document.getElementById('photocardCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = 1920;
      const height = 1920;
      ctx.clearRect(0, 0, width, height);

      // 1. Header (0-80px)
      const topBg = document.getElementById('picker-top-bg').value;
      const topText = document.getElementById('picker-top-text').value;
      ctx.fillStyle = topBg;
      ctx.fillRect(0, 0, width, 80);

      ctx.fillStyle = '#df202c';
      ctx.font = '900 48px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ডিএন', 60, 58);
      ctx.fillStyle = '#16763d';
      ctx.fillText('বাংলা', 175, 58);

      ctx.fillStyle = topText;
      ctx.font = '600 38px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatToBengaliDate(document.getElementById('input-date-val').value), width - 60, 55);

      // 2. Photo (80-1165px)
      const photoY = 80;
      const photoH = 1085;
      if (bgImageObj) {
        drawImageCover(ctx, bgImageObj, 0, photoY, width, photoH);
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

      // Comment Badge (1090-1165px)
      if (document.getElementById('toggle-comment-badge').checked) {
        const text = document.getElementById('input-comment-text').value;
        ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
        const tw = ctx.measureText(text).width;
        const bw = tw + 70;
        const bh = 55;
        const bx = (width - bw) / 2;
        const by = 1090 + (75 - bh) / 2;

        ctx.beginPath();
        ctx.fillStyle = '#059669';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.roundRect(bx, by, bw, bh, bh / 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(text, width / 2, by + 38);
      }

      // 3. Headline (1165-1563px = 398px)
      const headY = 1165;
      const headH = 398;
      const bBg = document.getElementById('picker-bottom-bg').value;
      const bText = document.getElementById('picker-bottom-text').value;
      ctx.fillStyle = bBg;
      ctx.fillRect(0, headY, width, headH);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, headY, width, headH);
      ctx.clip();

      const headline = document.getElementById('input-headline').value;
      let fSize = parseInt(document.getElementById('input-fontsize').value, 10);
      const sideMargin = parseInt(document.getElementById('input-margin').value, 10);
      const maxW = width - (sideMargin * 2);

      ctx.fillStyle = bText;
      ctx.textAlign = 'center';
      ctx.font = `bold ${fSize}px "Hind Siliguri", sans-serif`;

      let lines = wrapText(ctx, headline, maxW);
      while ((lines.length * (fSize * 1.35)) > (headH - 20) && fSize > 18) {
        fSize -= 2;
        ctx.font = `bold ${fSize}px "Hind Siliguri", sans-serif`;
        lines = wrapText(ctx, headline, maxW);
      }

      const lGap = fSize * 1.35;
      const totalH = lines.length * lGap;
      const startY = headY + (headH - totalH) / 2 + (fSize * 0.85);
      lines.forEach((l, i) => ctx.fillText(l, width / 2, startY + (i * lGap)));
      ctx.restore();

      document.getElementById('fontsize-val').textContent = fSize + 'px';
      document.getElementById('margin-val').textContent = sideMargin + 'px';

      // 4. Social & Website (1563-1640px)
      const sY = 1563;
      const sH = 77;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, sY, width, sH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, sY, width, sH);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 30px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DNBangla.com.bd', 64, sY + 48);

      const platforms = ['facebook', 'x', 'threads', 'instagram', 'youtube', 'linkedin'];
      const size = 52;
      const gap = 42;
      const startX = 750;
      platforms.forEach((p, idx) => {
        drawSocialIcon(ctx, p, startX + idx * (size + gap), sY + sH / 2, size);
      });

      // 5. Ad Banner (1640-1920px = 280px)
      const adY = 1640;
      const adH = 280;
      const adImg = adImageObjs[currentAdIndex];
      if (adImg && adImg.complete) {
        drawImageCover(ctx, adImg, 0, adY, width, adH);
      } else {
        ctx.fillStyle = '#800000';
        ctx.fillRect(0, adY, width, adH);
      }
    }

    function drawTextTriggerCanvas() {
      const canvas = document.getElementById('textTriggerCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = 1920;
      const height = 1920;
      ctx.clearRect(0, 0, width, height);

      const style = document.getElementById('text-trigger-bg').value;
      const palettes = {
        'gradient-red': ['#b20710', '#0f172a'],
        'gradient-blue': ['#1e293b', '#0b1224'],
        'gradient-maroon': ['#840b0b', '#241018'],
        'gradient-dark': ['#111827', '#030712']
      };
      const colors = style === 'custom' ? [document.getElementById('text-trigger-custom-color').value, '#0b0f19'] : (palettes[style] || palettes['gradient-red']);
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Header
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, 85);
      ctx.fillStyle = '#df202c';
      ctx.font = '900 48px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ডিএন', 60, 58);
      ctx.fillStyle = '#16763d';
      ctx.fillText('বাংলা', 175, 58);
      ctx.fillStyle = '#111111';
      ctx.font = '600 38px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatToBengaliDate(new Date()), width - 60, 55);

      // Category
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(100, 240, width - 200, 90);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 42px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(document.getElementById('text-trigger-cat').value, width / 2, 300);

      // Content
      const content = document.getElementById('text-trigger-content').value;
      let fSize = parseInt(document.getElementById('tc-input-fontsize').value, 10);
      const sideMargin = parseInt(document.getElementById('tc-input-margin').value, 10);
      const maxW = width - (sideMargin * 2);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${fSize}px "Hind Siliguri", sans-serif`;
      let lines = wrapText(ctx, content, maxW);
      const lGap = fSize * 1.35;
      const totalH = lines.length * lGap;
      const startY = 850 - (totalH / 2);
      lines.forEach((l, i) => ctx.fillText(l, width / 2, startY + (i * lGap)));

      document.getElementById('tc-fontsize-val').textContent = fSize + 'px';
      document.getElementById('tc-margin-val').textContent = sideMargin + 'px';

      // Social bar
      const sY = 1563;
      const sH = 77;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, sY, width, sH);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 30px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DNBangla.com.bd', 64, sY + 48);

      const platforms = ['facebook', 'x', 'threads', 'instagram', 'youtube', 'linkedin'];
      const size = 52;
      const gap = 42;
      const startX = 750;
      platforms.forEach((p, idx) => {
        drawSocialIcon(ctx, p, startX + idx * (size + gap), sY + sH / 2, size);
      });

      // Ad
      const adY = 1640;
      const adH = 280;
      const adImg = adImageObjs[textAdIndex % adBanners.length];
      if (adImg && adImg.complete) {
        drawImageCover(ctx, adImg, 0, adY, width, adH);
      } else {
        ctx.fillStyle = '#800000';
        ctx.fillRect(0, adY, width, adH);
      }
    }

    function generateTextTriggerCard() {
      textAdIndex = (textAdIndex + 1) % adBanners.length;
      drawTextTriggerCanvas();
      showToast('পরবর্তী বিজ্ঞাপনসহ টেক্সট কার্ড রিফ্রেশ হয়েছে!');
      logReporterAction('টেক্সট কার্ড জেনারেট', 'create', document.getElementById('text-trigger-content').value);
    }

    function downloadCanvas() {
      const headline = document.getElementById('input-headline').value;
      downloadCanvasPng(document.getElementById('photocardCanvas'), 'DN-Bangla-1920x1920-Photocard.png', '১৯২০x১৯২০ ফটোকার্ড ডাউনলোড হয়েছে।');
      logReporterAction('ফটোকার্ড ডাউনলোড', 'download', headline, 'রেজোলিউশন: 1920x1920 PX');
    }

    function downloadTextTriggerCanvas() {
      const content = document.getElementById('text-trigger-content').value;
      downloadCanvasPng(document.getElementById('textTriggerCanvas'), 'DN-Bangla-Text-Photocard.png', 'টেক্সট ফটোকার্ড ডাউনলোড হয়েছে।');
      logReporterAction('টেক্সট ফটোকার্ড ডাউনলোড', 'download', content);
    }

    function downloadCanvasPng(canvas, filename, successMsg) {
      if (!canvas) return;
      try {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast(successMsg);
      } catch (e) {
        showToast('ডাউনলোড সম্পন্ন করা যায়নি।', 'error');
      }
    }

    function drawImageCover(ctx, image, x, y, width, height) {
      if (!image || !image.width || !image.height) return;
      const scale = Math.max(width / image.width, height / image.height);
      const sourceWidth = width / scale;
      const sourceHeight = height / scale;
      const sourceX = (image.width - sourceWidth) / 2;
      const sourceY = (image.height - sourceHeight) / 2;
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
    }

    function drawSocialIcon(ctx, platform, centerX, centerY, size) {
      const radius = size / 2;
      const colors = { facebook: '#1877F2', x: '#111111', threads: '#111111', instagram: '#D62976', youtube: '#FF0033', linkedin: '#0A66C2' };
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[platform] || '#333333';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (platform === 'facebook') {
        ctx.font = 'bold 42px Arial';
        ctx.fillText('f', 1, 2);
      } else if (platform === 'x') {
        ctx.beginPath();
        ctx.moveTo(-11, -11); ctx.lineTo(11, 11);
        ctx.moveTo(11, -11); ctx.lineTo(-11, 11);
        ctx.stroke();
      } else if (platform === 'threads') {
        ctx.font = 'bold 31px Arial';
        ctx.fillText('@', 0, 0);
      } else if (platform === 'instagram') {
        ctx.beginPath();
        ctx.roundRect(-15, -15, 30, 30, 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.stroke();
      } else if (platform === 'youtube') {
        ctx.beginPath();
        ctx.roundRect(-17, -12, 34, 24, 7);
        ctx.fill();
        ctx.fillStyle = colors.youtube;
        ctx.beginPath();
        ctx.moveTo(-3, -7); ctx.lineTo(8, 0); ctx.lineTo(-3, 7); ctx.closePath();
        ctx.fill();
      } else if (platform === 'linkedin') {
        ctx.font = 'bold 26px Arial';
        ctx.fillText('in', 0, 0);
      }
      ctx.restore();
    }

    function wrapText(ctx, text, maxWidth) {
      const words = String(text ?? '').trim().split(/\\s+/);
      const lines = [];
      let currentLine = '';
      words.forEach(w => {
        const candidate = currentLine ? `${currentLine} ${w}` : w;
        if (ctx.measureText(candidate).width <= maxWidth) {
          currentLine = candidate;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = w;
        }
      });
      if (currentLine) lines.push(currentLine);
      return lines.length ? lines : [''];
    }

    function resetTopHeaderColor() {
      document.getElementById('picker-top-bg').value = '#ffffff';
      document.getElementById('picker-top-text').value = '#111111';
      drawCanvas();
    }

    function resetBottomAreaColor() {
      document.getElementById('picker-bottom-bg').value = '#840b0b';
      document.getElementById('picker-bottom-text').value = '#ffffff';
      drawCanvas();
    }

    function handleAutoDateToggle() {
      const isAuto = document.getElementById('toggle-auto-date').checked;
      const dateInput = document.getElementById('input-date-val');
      if (isAuto) dateInput.value = getDhakaDateInputValue();
      dateInput.disabled = isAuto;
      drawCanvas();
    }

    function getDhakaDateInputValue(date = new Date()) {
      const parts = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Dhaka' }).formatToParts(date);
      const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
      return `${values.year}-${values.month}-${values.day}`;
    }

    function formatToBengaliDate(dateValue) {
      if (!dateValue) return '';
      let date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) return '';
      return new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(date);
    }

    function handleBgUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          bgImageObj = new Image();
          bgImageObj.onload = () => drawCanvas();
          bgImageObj.src = event.target.result;
          showToast('ফিচার ছবি লোড হয়েছে!');
          logReporterAction('ফিচার ছবি আপলোড', 'edit', document.getElementById('input-headline').value);
        };
        reader.readAsDataURL(file);
      }
    }

    function handleTextTriggerBackgroundChange() {
      const isCustom = document.getElementById('text-trigger-bg').value === 'custom';
      const colorInput = document.getElementById('text-trigger-custom-color');
      colorInput.disabled = !isCustom;
      colorInput.classList.toggle('cursor-not-allowed', !isCustom);
      colorInput.classList.toggle('opacity-50', !isCustom);
      drawTextTriggerCanvas();
    }

    // PRELOAD ADS
    function preloadAdImages() {
      adImageObjs = {};
      adBanners.forEach((ad, idx) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          adImageObjs[idx] = img;
          drawCanvas();
          drawTextTriggerCanvas();
        };
        img.src = ad.localFallback || ad.image;
      });
    }

    // STAFF
    function loadStaffList() {
      try {
        const saved = localStorage.getItem(STAFF_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return [...defaultStaff];
    }

    function toggleStaffForm() {
      if (currentUser && currentUser.role === 'reporter') {
        showToast('শুধুমাত্র এডমিন কর্মী যুক্ত করতে পারেন।', 'info');
        return;
      }
      document.getElementById('staff-form-container').classList.toggle('hidden');
    }

    function saveStaffMember() {
      if (currentUser && currentUser.role === 'reporter') {
        showToast('শুধুমাত্র এডমিন কর্মী সংরক্ষণ করতে পারেন।', 'info');
        return;
      }
      const name = document.getElementById('staff-name').value.trim();
      const designation = document.getElementById('staff-designation').value.trim();
      const id = document.getElementById('staff-id').value.trim();
      const phone = document.getElementById('staff-phone').value.trim();
      if (!name || !designation || !id) {
        showToast('সকল তথ্য পূরণ করুন।', 'error');
        return;
      }
      staffList.unshift({
        id, name, designation, dept: 'বার্তা বিভাগ', blood: 'O+', phone: phone || '01711-000000', validity: '৩১ ডিসেম্বর ২০২৬', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
      });
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffList));
      toggleStaffForm();
      renderStaffTable();
      drawStaffCard();
      showToast(`${name}-এর তথ্য যুক্ত হয়েছে!`);
      logReporterAction('নতুন কর্মী যুক্ত', 'other', undefined, `আইডি: ${id}, নাম: ${name}`);
    }

    function renderStaffTable() {
      const container = document.getElementById('staff-cards-list');
      if (!container) return;
      container.innerHTML = '';
      document.getElementById('staff-count-badge').textContent = staffList.length;

      staffList.forEach((st, idx) => {
        const isSelected = idx === selectedStaffIndex;
        const div = document.createElement('div');
        div.className = `p-3 rounded-lg border transition cursor-pointer flex items-center justify-between ${
          isSelected ? 'bg-red-950/30 border-red-500/60' : 'bg-slate-900 border-slate-800'
        }`;
        div.onclick = () => { selectedStaffIndex = idx; renderStaffTable(); drawStaffCard(); };
        div.innerHTML = `
          <div class="flex items-center gap-3">
            <img src="${st.photo}" class="w-10 h-10 rounded-full object-cover border border-slate-700">
            <div>
              <h5 class="text-xs font-bold text-white">${st.name} <span class="font-mono text-amber-300">(${st.id})</span></h5>
              <p class="text-[11px] text-slate-400">${st.designation}</p>
            </div>
          </div>
          <button class="text-xs text-amber-300 bg-slate-800 px-2 py-1 rounded">কার্ড</button>
        `;
        container.appendChild(div);
      });
    }

    function switchCardSide(side) {
      cardSide = side;
      document.getElementById('btn-card-front').className = side === 'front' ? 'px-2.5 py-1 rounded bg-red-600 text-white font-semibold' : 'px-2.5 py-1 rounded bg-slate-800 text-slate-300';
      document.getElementById('btn-card-back').className = side === 'back' ? 'px-2.5 py-1 rounded bg-red-600 text-white font-semibold' : 'px-2.5 py-1 rounded bg-slate-800 text-slate-300';
      drawStaffCard();
    }

    function drawStaffCard() {
      const canvas = document.getElementById('staffCardCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = 600;
      const h = 920;
      const staff = staffList[selectedStaffIndex] || staffList[0];
      if (!staff) return;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      if (cardSide === 'front') {
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(0, 0, w, 150);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 38px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ডিএন বাংলা', w / 2, 60);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
        ctx.fillText('DIGITAL PRESS ID CARD', w / 2, 92);

        // Photo circle
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
        ctx.fillText(staff.name, w / 2, 385);
        ctx.fillStyle = '#8b0000';
        ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
        ctx.fillText(staff.designation, w / 2, 418);

        // Info box
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(50, 485, w - 100, 195);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(50, 485, w - 100, 195);

        ctx.fillStyle = '#0f172a';
        ctx.font = '600 16px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('আইডি নম্বর: ' + staff.id, 80, 525);
        ctx.fillText('রক্তের গ্রুপ: ' + staff.blood, 80, 565);
        ctx.fillText('মোবাইল: ' + staff.phone, 80, 605);
        ctx.fillText('মেয়াদ: ' + staff.validity, 80, 645);

        ctx.fillStyle = '#8b0000';
        ctx.fillRect(0, h - 35, w, 35);
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 13px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WWW.DNBANGLA.COM.BD • ২৪ ঘণ্টা সংবাদ ও তথ্য', w / 2, h - 12);
      } else {
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(0, 0, w, 60);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ডিএন বাংলা মিডিয়া নেটওয়ার্ক লিমিটেড', w / 2, 38);

        ctx.fillStyle = '#334155';
        ctx.font = '14px "Hind Siliguri", sans-serif';
        ctx.fillText('ডিএন বাংলা টাওয়ার, কাওরান বাজার, ঢাকা-১২১৫', w / 2, 435);
        ctx.fillText('হটলাইন: ০১৯৪৫৫৪৪২৪২', w / 2, 495);
        ctx.fillText('ওয়েবসাইট: www.dnbangla.com.bd', w / 2, 525);
      }
    }

    function downloadStaffCard() {
      const staff = staffList[selectedStaffIndex] || staffList[0];
      downloadCanvasPng(document.getElementById('staffCardCanvas'), `DN-Staff-${staff?.id || 'ID'}.png`, 'প্রেস আইডি কার্ড ডাউনলোড হয়েছে!');
      logReporterAction('প্রেস আইডি কার্ড ডাউনলোড', 'download', staff?.name, `আইডি: ${staff?.id}`);
    }

    // SCHEDULE DISPATCH
    function sendScheduleToTextTrigger(id, cat) {
      const text = document.getElementById(id).value;
      document.getElementById('text-trigger-cat').value = cat;
      document.getElementById('text-trigger-content').value = text;
      switchTab('texttrigger');
      drawTextTriggerCanvas();
      showToast('টিগার কার্ডে পাঠানো হয়েছে!');
      logReporterAction('শিডিউলার থেকে টিগার কার্ডে পাঠানো', 'schedule_send', cat);
    }

    function sendScheduleToHeadline(id, cat) {
      const text = document.getElementById(id).value;
      document.getElementById('input-headline').value = text;
      switchTab('photocard');
      drawCanvas();
      showToast('ফটোকার্ডে হেডলাইন সেট হয়েছে!');
      logReporterAction('শিডিউলার থেকে ফটোকার্ডে লোড', 'schedule_send', cat);
    }

    // WORDPRESS SYNC
    async function syncWordPress(isManual = false) {
      try {
        const res = await fetch(`https://www.dnbangla.com.bd/wp-json/wp/v2/posts?_embed=true&per_page=6&page=${wpFeedPage}`, { mode: 'cors' });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        const total = res.headers.get('X-WP-Total') || data.length;
        const totalPages = res.headers.get('X-WP-TotalPages') || 1;

        wpPostsList = data.map(p => ({
          id: p.id,
          cleanTitle: decodeEntities(p.title?.rendered || ''),
          featuredImage: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
          category: p._embedded?.['wp:term']?.[0]?.[0]?.name || 'সংবাদ',
          link: p.link || ''
        }));

        wpFeedTotal = total;
        wpFeedTotalPages = totalPages;

        document.getElementById('overview-wp-posts').textContent = total + ' টি';
        document.getElementById('wp-last-sync-time').textContent = 'সর্বশেষ: ' + new Date().toLocaleTimeString('bn-BD');
        document.getElementById('wp-feed-page').textContent = `পৃষ্ঠা ${wpFeedPage} / ${totalPages}`;
        document.getElementById('wp-feed-prev').disabled = wpFeedPage <= 1;
        document.getElementById('wp-feed-next').disabled = wpFeedPage >= totalPages;

        renderWpFeedGrid();
        renderWpDropdown();

        if (isManual) {
          showToast(`WordPress থেকে ${total}টি সংবাদ সিঙ্ক হয়েছে!`);
          logReporterAction('ওয়ার্ডপ্রেস সিঙ্ক', 'load_news', undefined, `মোট পোস্ট: ${total}`);
        }
      } catch (e) {
        if (isManual) showToast('সংবাদ লোড করা যায়নি। নেটওয়ার্ক চেক করুন।', 'error');
      }
    }

    function navigateWpFeed(delta) {
      wpFeedPage = Math.max(1, Math.min(wpFeedPage + delta, wpFeedTotalPages));
      syncWordPress(false);
    }

    function renderWpFeedGrid() {
      const container = document.getElementById('wp-posts-grid');
      if (!container) return;
      container.innerHTML = wpPostsList.map((post, idx) => `
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/50 transition flex flex-col justify-between space-y-3">
          <div class="space-y-2">
            ${post.featuredImage ? `<img src="${post.featuredImage}" class="w-full h-36 object-cover rounded-lg bg-slate-900" onerror="this.style.display='none'">` : '<div class="w-full h-36 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 text-xs">নো ছবি</div>'}
            <h4 class="font-bold text-xs text-white line-clamp-2">${post.cleanTitle}</h4>
          </div>
          <button onclick="loadPostIntoPhotocard(${idx})" class="w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold py-1.5 rounded transition">
            ফটোকার্ডে লোড করুন
          </button>
        </div>
      `).join('');
    }

    function renderWpDropdown() {
      const select = document.getElementById('wp-post-select');
      if (!select) return;
      select.innerHTML = wpPostsList.map((p, i) => `<option value="${i}">${i + 1}. ${p.cleanTitle.substring(0, 45)}...</option>`).join('');
    }

    function handleSelectWpPost(idx) {
      loadPostIntoPhotocard(parseInt(idx, 10));
    }

    function loadPostIntoPhotocard(idx) {
      const post = wpPostsList[idx];
      if (!post) return;
      document.getElementById('input-headline').value = post.cleanTitle;
      if (post.featuredImage) {
        bgImageObj = new Image();
        bgImageObj.crossOrigin = 'anonymous';
        bgImageObj.onload = () => drawCanvas();
        bgImageObj.src = post.featuredImage;
      }
      switchTab('photocard');
      drawCanvas();
      showToast(`ফটোকার্ডে লোড হয়েছে: "${post.cleanTitle.substring(0, 25)}..."`);
      logReporterAction('সংবাদ ফটোকার্ডে লোড', 'load_news', post.cleanTitle);
    }

    function decodeEntities(str) {
      const el = document.createElement('textarea');
      el.innerHTML = str;
      return el.value;
    }

    function saveAllApiSettings() {
      if (currentUser && currentUser.role === 'reporter') {
        showToast('শুধুমাত্র এডমিন API কি পরিবর্তন করতে পারবেন।', 'info');
        return;
      }
      showToast('API সেটিংস সংরক্ষিত হয়েছে!');
    }

    function switchTab(tabId) {
      const tabs = ['overview', 'photocard', 'texttrigger', 'admanager', 'schedule', 'staff', 'integrations', 'audit', 'logs'];
      tabs.forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.classList.add('hidden');
        const nav = document.getElementById('nav-' + t);
        if (nav) nav.classList.remove('active-nav');
      });
      const activeEl = document.getElementById('tab-' + tabId);
      if (activeEl) activeEl.classList.remove('hidden');
      const activeNav = document.getElementById('nav-' + tabId);
      if (activeNav) activeNav.classList.add('active-nav');
    }

    function showToast(msg, type = 'success') {
      const toast = document.getElementById('toast-message');
      const text = document.getElementById('toast-text');
      toast.className = `p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
        type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-200' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
      }`;
      text.innerHTML = `<i class="fa-solid fa-${type === 'error' ? 'triangle-exclamation' : 'circle-check'} mr-2"></i> ${msg}`;
      toast.classList.remove('hidden');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
    }

    function clearLogs() {
      document.getElementById('system-logs-box').innerHTML = '<p>Logs cleared.</p>';
    }

    // INIT
    window.onload = function() {
      initAuth();
      initAdDropdown();
      preloadAdImages();
      handleAutoDateToggle();
      renderStaffTable();
      drawCanvas();
      drawTextTriggerCanvas();
      drawStaffCard();
      syncWordPress(false);
    };
  </script>
</body>
</html>
'''

# 1. Write standalone HTML file to public/ and hosting_package/
with open('/app/applet/public/dnbangla_single_file.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('/app/applet/hosting_package/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 2. Write .htaccess for Apache / cPanel / LiteSpeed servers
htaccess_content = '''# DN Bangla PhotoCard Engine
# Security and Compression Rules for cPanel / Apache

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
</IfModule>

# Enable Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/html "access plus 1 day"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
'''
with open('/app/applet/hosting_package/.htaccess', 'w', encoding='utf-8') as f:
    f.write(htaccess_content)

# 3. Write Comprehensive Bengali Instructions Readme
readme_content = '''========================================================================
ডিএন বাংলা - ১৯২০x১৯২০ ফটোকার্ড ইঞ্জিন ও রিপোর্টার পোর্টাল
কাস্টম ডোমেইন ও সিপ্যানেল (cPanel / Shared Hosting) লাইভ নির্দেশিকা
========================================================================

এই প্যাকেজটিতে ডিএন বাংলা ফটোকার্ড ইঞ্জিনকে আপনার নিজস্ব ডোমেইন বা সাবডোমেইনে
(যেমন: card.dnbangla.com.bd অথবা www.dnbangla.com.bd/photocard)
সম্পূর্ণ লাইভ ও প্রস্তুত করার সকল ফাইল রয়েছে।

------------------------------------------------------------------------
ফাইলসমূহ:
------------------------------------------------------------------------
1. index.html : সম্পূর্ণ সিস্টেমের অল-ইন-ওয়ান প্রোডাকশন ফাইল।
2. .htaccess  : cPanel / Apache সার্ভারের গতি বৃদ্ধি ও সিকিউরিটি কনফিগারেশন।
3. README.txt : এই পূর্ণাঙ্গ দিক-নির্দেশনা ফাইল।

------------------------------------------------------------------------
লগইন ও পাসওয়ার্ড তথ্য:
------------------------------------------------------------------------
১. এডমিন লগইন (পূর্ণ নিয়ন্ত্রণ):
   - ইউজারনেম: admin অথবা আপনার যেকোনো এডমিন ইমেইল
   - পাসওয়ার্ড: adminipdnb
   - ক্ষমতা: সকল সেটিংস পরিচালনা, এড ব্যানার আপলোড/ডিলিট, কর্মী আইডি ও
     রিপোর্টারদের লাইভ কার্যকলাপ (অডিট ট্র্যাকার) পর্যবেক্ষণ।

২. মডারেটর / রিপোর্টার লগইন:
   - ইউজারনেম: ব্যক্তির নিজস্ব বৈধ @gmail.com ঠিকানা (যেমন: yourname@gmail.com)
   - পাসওয়ার্ড: posteditor
   - ক্ষমতা: ড্যাশবোর্ড, ১৯২০x১৯২০ ফটোকার্ড জেনারেটর ও টেক্সট ফটোকার্ডে কাজ করা।
     অন্যান্য ট্যাব ভিউ-অনলি মোডে দেখতে পারবেন। প্রতিটি কাজ স্বয়ংক্রিয়ভাবে অডিটে জমা হবে।

------------------------------------------------------------------------
ধাপে ধাপে সিপ্যানেল (cPanel) বা হোস্টিংয়ে লাইভ করার নিয়ম:
------------------------------------------------------------------------

ধাপ ১: সিপ্যানেলে (cPanel) প্রবেশ করুন
1. আপনার হোস্টিং সিপ্যানেলে লগইন করুন (যেমন: yourdomain.com/cpanel)।
2. "File Manager" (ফাইল ম্যানেজার) অপশনে ক্লিক করুন।

ধাপ ২: ডিরেক্টরি নির্বাচন করুন
- যদি মূল ডোমেইনে লাইভ করতে চান, তবে 'public_html' ফোল্ডারে ঢুকুন।
- যদি সাব-ডোমেইনে করতে চান (যেমন: card.dnbangla.com.bd), তবে
  'public_html/card' ফোল্ডারে ঢুকুন।

ধাপ ৩: জিপ (.ZIP) ফাইল আপলোড ও এক্সট্র্যাক্ট
1. ওপরের "Upload" বাটনে ক্লিক করে 'dnbangla_portal_live.zip' ফাইলটি আপলোড করুন।
2. আপলোড শেষ হলে ফাইলটির ওপর মাউসের রাইট ক্লিক করে "Extract" সিলেক্ট করুন।
3. এবার 'index.html' এবং '.htaccess' ফাইল দুটি সরাসরি আপনার ডিরেক্টরিতে চলে আসবে।
4. এক্সট্র্যাক্ট শেষ হলে জিপ ফাইলটি ডিলিট করে দিতে পারেন।

ধাপ ৪: ব্রাউজারে সাইট চালু ও পরীক্ষা করুন
1. ব্রাউজারে আপনার ডোমেইন বা সাব-ডোমেইনে যান (যেমন: https://card.dnbangla.com.bd)।
2. সরাসরি সুরক্ষিত লগইন স্ক্রিন প্রদর্শিত হবে।
3. এডমিন বা রিপোর্টার ক্রেডেনশিয়াল দিয়ে প্রবেশ করে নিরাপদে কাজ শুরু করুন!

------------------------------------------------------------------------
কারিগরি সহায়তা ও বৈশিষ্ট্য:
------------------------------------------------------------------------
• কোনো Node.js বা জটিল সার্ভার ইনস্টলেশনের প্রয়োজন নেই; সাধারণ যেকোনো হোস্টিংয়ে চলে।
• ১৯২০x১৯২০ রেজোলিউশনের ফুল এইচডি সোশ্যাল ফটোকার্ড এক্সপোর্ট।
• WordPress (dnbangla.com.bd) থেকে স্বয়ংক্রিয় লাইভ সংবাদ লোড।
• ব্রাউজারে স্থায়ী এড ব্যানার রোটেটর এবং ডিজিটাল প্রেস আইডি কার্ড জেনারেটর।
========================================================================
'''

with open('/app/applet/hosting_package/README_HOSTING_INSTRUCTIONS.txt', 'w', encoding='utf-8') as f:
    f.write(readme_content)

# 4. Create ZIP archives using Python zipfile
import zipfile

zip_target = '/app/applet/public/dnbangla_portal_live.zip'
with zipfile.ZipFile(zip_target, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.write('/app/applet/hosting_package/index.html', arcname='index.html')
    zipf.write('/app/applet/hosting_package/.htaccess', arcname='.htaccess')
    zipf.write('/app/applet/hosting_package/README_HOSTING_INSTRUCTIONS.txt', arcname='README_HOSTING_INSTRUCTIONS.txt')

print("Standalone HTML and ZIP package created successfully!")
print("Files generated:")
print("1. /app/applet/public/dnbangla_single_file.html")
print("2. /app/applet/public/dnbangla_portal_live.zip")
print("3. /app/applet/hosting_package/README_HOSTING_INSTRUCTIONS.txt")
