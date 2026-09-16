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
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-150 text-sm font-semibold text-slate-700"
        aria-label={t.languageToggleLabel}
        aria-expanded={open}
      >
        <Globe className="w-5 h-5 text-sky-600" />
        <span className="hidden sm:inline">{t.langNames[lang]}</span>
        <span className="sm:hidden">{lang.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-[fadeInUp_0.15s_ease-out]">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-100 ${
                l === lang
                  ? 'bg-sky-50 text-sky-700'
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
    }
  > = {
    Dangerous: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-900',
      label: t.threatLabels.Dangerous,
      icon: AlertTriangle,
    },
    Suspicious: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      label: t.threatLabels.Suspicious,
      icon: Info,
    },
    Safe: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      label: t.threatLabels.Safe,
      icon: CheckCircle2,
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
      className={`mt-8 ${c.bg} ${c.border} border-2 rounded-2xl p-6 sm:p-8 shadow-lg animate-[fadeInUp_0.4s_ease-out]`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
            result.threat_level === 'Dangerous'
              ? 'bg-red-200'
              : result.threat_level === 'Suspicious'
                ? 'bg-amber-200'
                : 'bg-emerald-200'
          }`}
        >
          <Icon className={`w-7 h-7 ${c.text}`} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl sm:text-2xl font-bold ${c.text}`}>{c.label}</h3>
          <p className={`text-sm sm:text-base font-medium ${c.text} opacity-70 mt-0.5`}>
            {t.scamTypePrefix} {result.scam_type}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className={`text-xs font-bold uppercase tracking-wide ${c.text} opacity-60 mb-1`}>
            {t.whatWeFound}
          </p>
          <p className={`text-base sm:text-lg leading-relaxed ${c.text}`}>{result.explanation}</p>
        </div>

        <div
          className={`p-4 rounded-xl ${
            result.threat_level === 'Dangerous'
              ? 'bg-red-100'
              : result.threat_level === 'Suspicious'
                ? 'bg-amber-100'
                : 'bg-emerald-100'
          }`}
        >
          <p className={`text-xs font-bold uppercase tracking-wide ${c.text} opacity-60 mb-1`}>
            {t.recommendedAction}
          </p>
          <p className={`text-base sm:text-lg leading-relaxed ${c.text} font-medium`}>
            {result.action}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        {isDangerous && (
          <a
            href="tel:1930"
            className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-lg font-bold py-4 px-6 rounded-xl shadow-md shadow-red-300 transition-all duration-200 hover:shadow-lg active:scale-[0.99] animate-[fadeInUp_0.3s_ease-out]"
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-600 flex items-center justify-center shadow-md shadow-sky-200">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  ScamShield
                </h1>
                <p className="text-base sm:text-lg text-slate-500 leading-snug">
                  {t.subtitle}
                </p>
              </div>
            </div>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Trust badge */}
        <div className="flex items-center gap-2 mb-5 text-slate-500">
          <Lock className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm sm:text-base">{t.trustBadge}</p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200 p-5 sm:p-7">
          <label
            htmlFor="message-input"
            className="block text-lg sm:text-xl font-semibold text-slate-800 mb-3"
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
              className="w-full text-lg sm:text-xl leading-relaxed text-slate-800 placeholder:text-slate-400 bg-slate-50 border-2 border-slate-200 rounded-xl p-4 sm:p-5 resize-y focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 disabled:opacity-60"
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

          <p className="text-sm text-slate-400 mt-2">
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
              className="flex-1 flex items-center justify-center gap-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-lg sm:text-xl font-bold py-4 sm:py-5 px-6 rounded-xl shadow-md shadow-sky-200 transition-all duration-200 hover:shadow-lg hover:shadow-sky-300 active:scale-[0.99]"
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
                className="sm:w-auto px-6 py-4 sm:py-5 rounded-xl border-2 border-slate-200 text-slate-600 text-lg font-semibold hover:bg-slate-50 transition-colors duration-150"
              >
                {t.clear}
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {analysisResult && <ResultCard result={analysisResult} lang={lang} />}

        {/* Example messages */}
        {!analysisResult && !isLoading && (
          <div className="mt-8">
            <p className="text-sm sm:text-base font-semibold text-slate-500 mb-3">
              {t.examplesTitle}
            </p>
            <div className="grid gap-3">
              {t.examples.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setUserInput(ex.text)}
                  className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all duration-200 group"
                >
                  <p className="text-sm font-bold text-sky-700 mb-1 group-hover:text-sky-800">
                    {ex.label}
                  </p>
                  <p className="text-base text-slate-500 line-clamp-2 leading-relaxed">
                    {ex.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8">
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
