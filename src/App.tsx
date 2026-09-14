import { useState, useCallback } from 'react';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ScanSearch,
  Lock,
  Heart,
  X,
  CheckCircle2,
  Info,
} from 'lucide-react';

type ThreatLevel = 'Dangerous' | 'Suspicious' | 'Safe';

interface AnalysisResult {
  threat_level: ThreatLevel;
  scam_type: string;
  explanation: string;
  action: string;
}

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

function analyzeThreat(text: string): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = text.toLowerCase().trim();

      if (lower.length === 0) {
        resolve({
          threat_level: 'Safe',
          scam_type: 'None',
          explanation: 'No message was provided to analyze.',
          action: 'Paste a message above to check if it is safe.',
        });
        return;
      }

      for (const [scamType, keywords] of Object.entries(THREAT_KEYWORDS)) {
        for (const kw of keywords) {
          if (lower.includes(kw)) {
            resolve({
              threat_level: 'Dangerous',
              scam_type: scamType,
              explanation: `This message contains patterns commonly used in ${scamType.toLowerCase()} scams. Scammers use these tactics to pressure you into acting quickly without thinking.`,
              action: 'Do not click any links or share personal information. Delete the message and block the sender. If you already responded, contact your bank immediately.',
            });
            return;
          }
        }
      }

      for (const kw of SUSPICIOUS_KEYWORDS) {
        if (lower.includes(kw)) {
          resolve({
            threat_level: 'Suspicious',
            scam_type: 'Potentially Misleading',
            explanation: 'This message contains some warning signs commonly seen in scams, but we cannot be certain. It uses language that may try to pressure or manipulate you.',
            action: 'Be cautious. Do not share personal or financial information. Verify the sender through an official channel before taking any action.',
          });
          return;
        }
      }

      resolve({
        threat_level: 'Safe',
        scam_type: 'None',
        explanation: 'This message does not show obvious signs of a scam. No urgency tactics, requests for sensitive information, or suspicious links were detected.',
        action: 'You can proceed, but always stay cautious. If something feels wrong, trust your instincts and ask a family member for help.',
      });
    }, 1500);
  });
}

function ResultCard({ result }: { result: AnalysisResult }) {
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
      label: 'Dangerous — Likely Scam',
      icon: AlertTriangle,
    },
    Suspicious: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      label: 'Suspicious — Use Caution',
      icon: Info,
    },
    Safe: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      label: 'Safe — No Threats Detected',
      icon: CheckCircle2,
    },
  };

  const c = config[result.threat_level];
  const Icon = c.icon;

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
            Scam Type: {result.scam_type}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className={`text-xs font-bold uppercase tracking-wide ${c.text} opacity-60 mb-1`}>
            What we found
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
            Recommended Action
          </p>
          <p className={`text-base sm:text-lg leading-relaxed ${c.text} font-medium`}>
            {result.action}
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (userInput.trim().length === 0 || isLoading) return;
    setIsLoading(true);
    setAnalysisResult(null);
    const result = await analyzeThreat(userInput);
    setAnalysisResult(result);
    setIsLoading(false);
  }, [userInput, isLoading]);

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
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-600 flex items-center justify-center shadow-md shadow-sky-200">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                ScamShield
              </h1>
              <p className="text-base sm:text-lg text-slate-500 leading-snug">
                Paste a message to check if it's safe
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Trust badge */}
        <div className="flex items-center gap-2 mb-5 text-slate-500">
          <Lock className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm sm:text-base">
            Your message is never stored or shared — it stays on your device.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200 p-5 sm:p-7">
          <label
            htmlFor="message-input"
            className="block text-lg sm:text-xl font-semibold text-slate-800 mb-3"
          >
            Paste the suspicious message below
          </label>
          <div className="relative">
            <textarea
              id="message-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Example: &quot;URGENT: Your bank account has been suspended. Click here to verify your password immediately...&quot;"
              disabled={isLoading}
              rows={6}
              className="w-full text-lg sm:text-xl leading-relaxed text-slate-800 placeholder:text-slate-400 bg-slate-50 border-2 border-slate-200 rounded-xl p-4 sm:p-5 resize-y focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 disabled:opacity-60"
              aria-label="Suspicious message to analyze"
            />
            {userInput.length > 0 && !isLoading && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors duration-150"
                aria-label="Clear message"
                title="Clear message"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-sm text-slate-400 mt-2">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-semibold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-semibold">Enter</kbd> to analyze quickly.
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
                  Analyzing...
                </>
              ) : (
                <>
                  <ScanSearch className="w-6 h-6" />
                  Analyze for Threats
                </>
              )}
            </button>
            {userInput.length > 0 && !isLoading && (
              <button
                onClick={handleClear}
                className="sm:w-auto px-6 py-4 sm:py-5 rounded-xl border-2 border-slate-200 text-slate-600 text-lg font-semibold hover:bg-slate-50 transition-colors duration-150"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {analysisResult && <ResultCard result={analysisResult} />}

        {/* Example messages */}
        {!analysisResult && !isLoading && (
          <div className="mt-8">
            <p className="text-sm sm:text-base font-semibold text-slate-500 mb-3">
              Not sure what to paste? Try an example:
            </p>
            <div className="grid gap-3">
              {[
                {
                  label: 'Urgent Bank Scam',
                  text: 'URGENT: Your bank account has been suspended. Click here to verify your password immediately or your account will be permanently closed.',
                },
                {
                  label: 'Prize Scam',
                  text: 'Congratulations! You have won a $500 Amazon gift card. Claim your prize now by clicking the link below. Limited time offer!',
                },
                {
                  label: 'Safe Message',
                  text: 'Hi Mom, it\'s Sarah. I\'ll be home around 6pm for dinner tonight. Can\'t wait to see you!',
                },
              ].map((ex) => (
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
              <p className="text-sm sm:text-base">
                ScamShield — Protecting seniors & families from digital fraud
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            This tool provides general guidance and is not a guarantee of safety. Always use your best judgment.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
