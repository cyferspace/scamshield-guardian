import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Loader2,
  ScanSearch,
  Lock,
  Heart,
  X,
  CheckCircle2,
  Info,
  Phone,
  Volume2,
  Square,
  Globe,
  ChevronDown,
  Building2,
  Gift,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  type Language,
  type ThreatLevel,
  type AnalysisResult,
  translations,
} from '@/translations';

const THREAT_KEYWORDS: Record<string, string[]> = {
  'Urgency / Phishing': ['urgent', 'bank', 'password', 'suspend', 'click here', 'verify your account', 'immediate action', 'account locked'],
  'Gift Card / Payment': ['gift card', 'itunes', 'google play card', 'wire transfer', 'bitcoin', 'crypto', 'payment method'],
  'Lottery / Prize': ['you have won', 'lottery', 'prize', 'claim your', 'congratulations you', 'winner'],
  'Romance / Impersonation': ['i love you', 'send money', 'stranded', 'military', 'oil rig', 'widow', 'inheritance'],
};

const SUSPICIOUS_KEYWORDS = [
  'limited time',
  'act now',
  'don\'t tell anyone',
  'keep this confidential',
  'wire',
  'money order',
  'prepaid',
  'dear customer',
  'dear user',
  'confirm your identity',
];

function analyzeThreat(text: string, lang: Language): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const t = translations[lang];
      const lower = text.toLowerCase().trim();

      if (lower.length === 0) {
        resolve({
          threat_level: 'Safe',
          scam_type: t.safeScamType,
          explanation: t.emptyExplanation,
          action: t.emptyAction,
        });
        return;
      }

      for (const [scamType, keywords] of Object.entries(THREAT_KEYWORDS)) {
        for (const kw of keywords) {
          if (lower.includes(kw)) {
            resolve({
              threat_level: 'Dangerous',
              scam_type: t.scamTypeNames[scamType],
              explanation: t.dangerousExplanation(scamType),
              action: t.dangerousAction,
            });
            return;
          }
        }
      }

      for (const kw of SUSPICIOUS_KEYWORDS) {
        if (lower.includes(kw)) {
          resolve({
            threat_level: 'Suspicious',
            scam_type: t.suspiciousScamType,
            explanation: t.suspiciousExplanation,
            action: t.suspiciousAction,
          });
          return;
        }
      }

      resolve({
        threat_level: 'Safe',
        scam_type: t.safeScamType,
        explanation: t.safeExplanation,
        action: t.safeAction,
      });
    }, 1500);
  });
}

const exampleIcons = [Building2, Gift, MessageCircle];

function LanguageToggle({
  lang,
  setLang,
}: {
  lang: Language;
  setLang: (l: Language) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const langs: Language[] = ['en', 'hi', 'mr'];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-teal-300 transition-all duration-200 text-sm font-semibold text-slate-700 shadow-sm"
        aria-label={t.languageToggleLabel}
        aria-expanded={open}
      >
        <Globe className="w-5 h-5 text-teal-600" />
        <span className="hidden sm:inline">{t.langNames[lang]}</span>
        <span className="sm:hidden">{lang.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-[fadeInUp_0.15s_ease-out]">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-100 ${
                l === lang
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.langNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultCard({
  result,
  lang,
}: {
  result: AnalysisResult;
  lang: Language;
}) {
  const t = translations[lang];
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const config: Record<
    ThreatLevel,
    {
      bg: string;
      border: string;
      text: string;
      label: string;
      icon: typeof AlertTriangle;
      iconBg: string;
      accentBg: string;
    }
  > = {
    Dangerous: {
      bg: 'bg-gradient-to-br from-red-50 to-rose-50',
      border: 'border-red-300',
      text: 'text-red-900',
      label: t.threatLabels.Dangerous,
      icon: AlertTriangle,
      iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
      accentBg: 'bg-red-100',
    },
    Suspicious: {
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      label: t.threatLabels.Suspicious,
      icon: Info,
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      accentBg: 'bg-amber-100',
    },
    Safe: {
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      label: t.threatLabels.Safe,
      icon: CheckCircle2,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      accentBg: 'bg-emerald-100',
    },
  };

  const c = config[result.threat_level];
  const Icon = c.icon;

  const handleSpeak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const fullText = `${t.whatWeFound}. ${result.explanation}. ${t.recommendedAction}. ${result.action}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = t.speechLang;
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSpeaking, result, t]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const isDangerous = result.threat_level === 'Dangerous';
  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div
      className={`mt-8 ${c.bg} ${c.border} border-2 rounded-3xl p-6 sm:p-8 shadow-xl animate-[fadeInUp_0.4s_ease-out] overflow-hidden relative`}
      role="status"
      aria-live="polite"
    >
      {isDangerous && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />
      )}

      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${c.iconBg} shadow-lg`}
        >
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl sm:text-2xl font-bold ${c.text} font-display`}>{c.label}</h3>
          <p className={`text-sm sm:text-base font-medium ${c.text} opacity-70 mt-0.5`}>
            {t.scamTypePrefix} {result.scam_type}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className={`text-xs font-bold uppercase tracking-wide ${c.text} opacity-60 mb-1.5`}>
            {t.whatWeFound}
          </p>
          <p className={`text-base sm:text-lg leading-relaxed ${c.text}`}>{result.explanation}</p>
        </div>

        <div className={`p-4 rounded-xl ${c.accentBg}`}>
          <p className={`text-xs font-bold uppercase tracking-wide ${c.text} opacity-60 mb-1.5`}>
            {t.recommendedAction}
          </p>
          <p className={`text-base sm:text-lg leading-relaxed ${c.text} font-medium`}>
            {result.action}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        {isDangerous && (
          <a
            href="tel:1930"
            className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-lg font-bold py-4 px-6 rounded-xl shadow-lg shadow-red-300/50 transition-all duration-200 hover:shadow-xl active:scale-[0.99] animate-[fadeInUp_0.3s_ease-out]"
          >
            <Phone className="w-6 h-6" />
            {t.callHelpline}
          </a>
        )}

        {speechSupported && (
          <button
            onClick={handleSpeak}
            className={`flex-1 flex items-center justify-center gap-3 text-lg font-bold py-4 px-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.99] ${
              isDangerous
                ? 'sm:flex-none border-2 border-red-300 text-red-700 hover:bg-red-50'
                : `border-2 ${c.border} ${c.text} hover:bg-black/5`
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-6 h-6" />
                {t.stopReading}
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6" />
                {t.readAloud}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  const handleAnalyze = useCallback(async () => {
    if (userInput.trim().length === 0 || isLoading) return;
    setIsLoading(true);
    setAnalysisResult(null);
    const result = await analyzeThreat(userInput, lang);
    setAnalysisResult(result);
    setIsLoading(false);
  }, [userInput, isLoading, lang]);

  const handleClear = useCallback(() => {
    setUserInput('');
    setAnalysisResult(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyze();
      }
    },
    [handleAnalyze],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-white to-slate-50 flex flex-col relative">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-200/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-300/50">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight font-display">
                  ScamShield
                </h1>
                <p className="text-sm sm:text-base text-slate-500 leading-snug">
                  {t.subtitle}
                </p>
              </div>
            </div>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        {/* Trust badge */}
        <div className="flex items-center gap-2.5 mb-5 text-slate-500">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
            <Lock className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-sm sm:text-base">{t.trustBadge}</p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-5 sm:p-7">
          <label
            htmlFor="message-input"
            className="block text-lg sm:text-xl font-semibold text-slate-800 mb-3 font-display"
          >
            {t.inputLabel}
          </label>
          <div className="relative">
            <textarea
              id="message-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              disabled={isLoading}
              rows={6}
              className="w-full text-lg sm:text-xl leading-relaxed text-slate-800 placeholder:text-slate-400 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 resize-y focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 disabled:opacity-60"
              aria-label={t.inputLabel}
            />
            {userInput.length > 0 && !isLoading && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors duration-150"
                aria-label={t.clearAria}
                title={t.clearAria}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-sm text-slate-400 mt-2.5">
            {t.tipPrefix}{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-semibold">
              {t.ctrlKey}
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-semibold">
              {t.enterKey}
            </kbd>{' '}
            {t.tipSuffix}
          </p>

          {/* Buttons */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || userInput.trim().length === 0}
              className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:scale-[0.99] disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white text-lg sm:text-xl font-bold py-4 sm:py-5 px-6 rounded-xl shadow-lg shadow-teal-300/40 transition-all duration-200 hover:shadow-xl hover:shadow-teal-300/50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <ScanSearch className="w-6 h-6" />
                  {t.analyze}
                </>
              )}
            </button>
            {userInput.length > 0 && !isLoading && (
              <button
                onClick={handleClear}
                className="sm:w-auto px-6 py-4 sm:py-5 rounded-xl border-2 border-slate-200 text-slate-600 text-lg font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                {t.clear}
              </button>
            )}
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-8 bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-lg animate-[fadeInUp_0.3s_ease-out]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-200 animate-pulse" />
              <div className="flex-1 space-y-2.5">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="mt-4 h-24 w-full bg-slate-100 rounded-xl animate-pulse" />
          </div>
        )}

        {/* Results */}
        {analysisResult && !isLoading && <ResultCard result={analysisResult} lang={lang} />}

        {/* Example messages */}
        {!analysisResult && !isLoading && (
          <div className="mt-8">
            <p className="text-sm sm:text-base font-semibold text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500" />
              {t.examplesTitle}
            </p>
            <div className="grid gap-3">
              {t.examples.map((ex, i) => {
                const ExampleIcon = exampleIcons[i] || MessageCircle;
                const isSafe = i === t.examples.length - 1;
                return (
                  <button
                    key={ex.label}
                    onClick={() => setUserInput(ex.text)}
                    className="text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all duration-200 group flex items-start gap-3"
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                        isSafe
                          ? 'bg-emerald-50 group-hover:bg-emerald-100'
                          : 'bg-red-50 group-hover:bg-red-100'
                      }`}
                    >
                      <ExampleIcon
                        className={`w-5 h-5 ${isSafe ? 'text-emerald-600' : 'text-red-500'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold mb-1 ${
                          isSafe
                            ? 'text-emerald-700 group-hover:text-emerald-800'
                            : 'text-red-700 group-hover:text-red-800'
                        }`}
                      >
                        {ex.label}
                      </p>
                      <p className="text-base text-slate-500 line-clamp-2 leading-relaxed">
                        {ex.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 mt-8 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-500">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <p className="text-sm sm:text-base">{t.footerMain}</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            {t.footerDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
