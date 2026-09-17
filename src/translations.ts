export type Language = 'en' | 'hi' | 'mr';
export type ThreatLevel = 'Dangerous' | 'Suspicious' | 'Safe';

export interface AnalysisResult {
  threat_level: ThreatLevel;
  scam_type: string;
  explanation: string;
  action: string;
}

export interface Translation {
  speechLang: string;
  subtitle: string;
  trustBadge: string;
  inputLabel: string;
  placeholder: string;
  tipPrefix: string;
  ctrlKey: string;
  enterKey: string;
  tipSuffix: string;
  analyze: string;
  analyzing: string;
  clear: string;
  clearAria: string;
  examplesTitle: string;
  examples: { label: string; text: string }[];
  threatLabels: Record<ThreatLevel, string>;
  scamTypePrefix: string;
  whatWeFound: string;
  recommendedAction: string;
  callHelpline: string;
  readAloud: string;
  stopReading: string;
  footerMain: string;
  footerDisclaimer: string;
  languageToggleLabel: string;
  langNames: Record<Language, string>;
  scamTypeNames: Record<string, string>;
  emptyExplanation: string;
  emptyAction: string;
  dangerousExplanation: (scamType: string) => string;
  dangerousAction: string;
  suspiciousScamType: string;
  suspiciousExplanation: string;
  suspiciousAction: string;
  safeScamType: string;
  safeExplanation: string;
  safeAction: string;
  errorTitle: string;
  errorScamType: string;
  errorExplanation: string;
  errorAction: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    speechLang: 'en-US',
    subtitle: "Paste a message to check if it's safe",
    trustBadge: 'Your message is never stored or shared — it stays on your device.',
    inputLabel: 'Paste the suspicious message below',
    placeholder: 'Example: "URGENT: Your bank account has been suspended. Click here to verify your password immediately..."',
    tipPrefix: 'Tip: Press',
    ctrlKey: 'Ctrl',
    enterKey: 'Enter',
    tipSuffix: 'to analyze quickly.',
    analyze: 'Analyze for Threats',
    analyzing: 'Analyzing...',
    clear: 'Clear',
    clearAria: 'Clear message',
    examplesTitle: 'Not sure what to paste? Try an example:',
    examples: [
      { label: 'Urgent Bank Scam', text: 'URGENT: Your bank account has been suspended. Click here to verify your password immediately or your account will be permanently closed.' },
      { label: 'Prize Scam', text: 'Congratulations! You have won a $500 Amazon gift card. Claim your prize now by clicking the link below. Limited time offer!' },
      { label: 'Safe Message', text: "Hi Mom, it's Sarah. I'll be home around 6pm for dinner tonight. Can't wait to see you!" },
    ],
    threatLabels: {
      Dangerous: 'Dangerous — Likely Scam',
      Suspicious: 'Suspicious — Use Caution',
      Safe: 'Safe — No Threats Detected',
    },
    scamTypePrefix: 'Scam Type:',
    whatWeFound: 'What we found',
    recommendedAction: 'Recommended Action',
    callHelpline: 'Call 1930 Cyber Helpline',
    readAloud: 'Read Warning Aloud',
    stopReading: 'Stop Reading',
    footerMain: 'ScamShield — Protecting seniors & families from digital fraud',
    footerDisclaimer: 'This tool provides general guidance and is not a guarantee of safety. Always use your best judgment.',
    languageToggleLabel: 'Select language',
    langNames: { en: 'English', hi: 'हिन्दी', mr: 'मराठी' },
    scamTypeNames: {
      'Urgency / Phishing': 'Urgency / Phishing',
      'Gift Card / Payment': 'Gift Card / Payment',
      'Lottery / Prize': 'Lottery / Prize',
      'Romance / Impersonation': 'Romance / Impersonation',
    },
    emptyExplanation: 'No message was provided to analyze.',
    emptyAction: 'Paste a message above to check if it is safe.',
    dangerousExplanation: (scamType: string) => `This message contains patterns commonly used in ${scamType.toLowerCase()} scams. Scammers use these tactics to pressure you into acting quickly without thinking.`,
    dangerousAction: 'Do not click any links or share personal information. Delete the message and block the sender. If you already responded, contact your bank immediately.',
    suspiciousScamType: 'Potentially Misleading',
    suspiciousExplanation: 'This message contains some warning signs commonly seen in scams, but we cannot be certain. It uses language that may try to pressure or manipulate you.',
    suspiciousAction: 'Be cautious. Do not share personal or financial information. Verify the sender through an official channel before taking any action.',
    safeScamType: 'None',
    safeExplanation: 'This message does not show obvious signs of a scam. No urgency tactics, requests for sensitive information, or suspicious links were detected.',
    safeAction: 'You can proceed, but always stay cautious. If something feels wrong, trust your instincts and ask a family member for help.',
    errorTitle: 'Analysis Failed',
    errorScamType: 'Error',
    errorExplanation: 'We could not analyze your message right now. Please check your internet connection and try again.',
    errorAction: 'If the problem persists, try again later or use your best judgment to evaluate the message.',
  },
  hi: {
    speechLang: 'hi-IN',
    subtitle: 'सुरक्षित है या नहीं जानने के लिए संदेश यहाँ डालें',
    trustBadge: 'आपका संदेश कभी सहेजा या साझा नहीं किया जाता — यह आपके डिवाइस पर ही रहता है।',
    inputLabel: 'संदिग्ध संदेश नीचे डालें',
    placeholder: 'उदाहरण: "जरूरी: आपका बैंक खाता निलंबित कर दिया गया है। अपना पासवर्ड तुरंत सत्यापित करने के लिए यहाँ क्लिक करें..."',
    tipPrefix: 'सुझाव: दबाएँ',
    ctrlKey: 'Ctrl',
    enterKey: 'Enter',
    tipSuffix: 'तेज़ी से जाँच करने के लिए।',
    analyze: 'जाँच करें',
    analyzing: 'जाँच हो रही है...',
    clear: 'साफ़ करें',
    clearAria: 'संदेश साफ़ करें',
    examplesTitle: 'क्या डालें, यह नहीं पता? एक उदाहरण आज़माएँ:',
    examples: [
      { label: 'बैंक धोखाधड़ी', text: 'जरूरी: आपका बैंक खाता निलंबित कर दिया गया है। अपना पासवर्ड तुरंत सत्यापित करने के लिए यहाँ क्लिक करें या आपका खाता स्थायी रूप से बंद हो जाएगा।' },
      { label: 'पुरस्कार धोखाधड़ी', text: 'बधाई हो! आपने $500 का अमेज़न गिफ्ट कार्ड जीता है। नीचे दिए लिंक पर क्लिक करके अपना पुरस्कार अभी क्लेम करें। सीमित समय का ऑफर!' },
      { label: 'सुरक्षित संदेश', text: 'हाय माँ, मैं सारा हूँ। आज रात के खाने के लिए मैं शाम 6 बजे घर पर होऊँगी। आपसे मिलने के लिए बेताब हूँ!' },
    ],
    threatLabels: {
      Dangerous: 'खतरनाक — संभावित धोखाधड़ी',
      Suspicious: 'संदिग्ध — सावधान रहें',
      Safe: 'सुरक्षित — कोई खतरा नहीं',
    },
    scamTypePrefix: 'धोखाधड़ी का प्रकार:',
    whatWeFound: 'हमें क्या मिला',
    recommendedAction: 'अनुशंसित कार्रवाई',
    callHelpline: '1930 साइबर हेल्पलाइन कॉल करें',
    readAloud: 'चेतावनी सुनें',
    stopReading: 'रोकें',
    footerMain: 'ScamShield — वरिष्ठ नागरिकों और परिवारों को डिजिटल धोखाधड़ी से बचाना',
    footerDisclaimer: 'यह उपकरण सामान्य मार्गदर्शन देता है और सुरक्षा की गारंटी नहीं है। हमेशा अपने विवेक का उपयोग करें।',
    languageToggleLabel: 'भाषा चुनें',
    langNames: { en: 'English', hi: 'हिन्दी', mr: 'मराठी' },
    scamTypeNames: {
      'Urgency / Phishing': 'तात्कालिकता / फ़िशिंग',
      'Gift Card / Payment': 'गिफ्ट कार्ड / भुगतान',
      'Lottery / Prize': 'लॉटरी / पुरस्कार',
      'Romance / Impersonation': 'रोमांस / धोखेबाज़ी',
    },
    emptyExplanation: 'जाँच के लिए कोई संदेश नहीं दिया गया।',
    emptyAction: 'सुरक्षित है या नहीं जानने के लिए ऊपर एक संदेश डालें।',
    dangerousExplanation: (scamType: string) => `इस संदेश में ${scamType.toLowerCase()} धोखाधड़ी में आमतौर पर उपयोग किए जाने वाले पैटर्न हैं। धोखेबाज़ बिना सोचे जल्दी कार्रवाई करने के लिए इन तरकीबों का उपयोग करते हैं।`,
    dangerousAction: 'किसी भी लिंक पर क्लिक न करें या निजी जानकारी साझा न करें। संदेश हटा दें और भेजने वाले को ब्लॉक करें। यदि आप पहले ही जवाब दे चुके हैं, तो तुरंत अपने बैंक से संपर्क करें।',
    suspiciousScamType: 'संभावित भ्रामक',
    suspiciousExplanation: 'इस संदेश में धोखाधड़ी में देखे जाने वाले कुछ चेतावनी संकेत हैं, लेकिन हम निश्चित नहीं हैं। इसमें आपको दबाव या हेरफेर करने वाली भाषा का उपयोग हो सकता है।',
    suspiciousAction: 'सावधान रहें। निजी या वित्तीय जानकारी साझा न करें। कोई कार्रवाई करने से पहले आधिकारिक चैनल के माध्यम से भेजने वाले को सत्यापित करें।',
    safeScamType: 'कोई नहीं',
    safeExplanation: 'इस संदेश में धोखाधड़ी के स्पष्ट संकेत नहीं हैं। कोई तात्कालिकता की तरकीब, संवेदनशील जानकारी का अनुरोध, या संदिग्ध लिंक नहीं मिले।',
    safeAction: 'आप आगे बढ़ सकते हैं, लेकिन हमेशा सतर्क रहें। यदि कुछ गलत लगे, तो अपनी सेहत पर भरोसा करें और किसी परिवार के सदस्य से मदद लें।',
    errorTitle: 'विश्लेषण विफल',
    errorScamType: 'त्रुटि',
    errorExplanation: 'हम अभी आपका संदेश विश्लेषित नहीं कर सके। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।',
    errorAction: 'यदि समस्या बनी रहती है, तो बाद में पुनः प्रयास करें या संदेश का मूल्यांकन करने के लिए अपने विवेक का उपयोग करें।',
  },
  mr: {
    speechLang: 'mr-IN',
    subtitle: 'सुरक्षित आहे का ते तपासण्यासाठी संदेश येथे पेस्ट करा',
    trustBadge: 'तुमचा संदेश कधीच साठवला जात नाही किंवा शेअर केला जात नाही — तो तुमच्या डिव्हाइसवरच राहतो.',
    inputLabel: 'संशयास्पद संदेश खाली पेस्ट करा',
    placeholder: 'उदाहरण: "तात्काळ: तुमचे बँक खाते निलंबित केले आहे. तुमचा पासवर्ड त्वरित सत्यापित करण्यासाठी येथे क्लिक करा..."',
    tipPrefix: 'टीप: दाबा',
    ctrlKey: 'Ctrl',
    enterKey: 'Enter',
    tipSuffix: 'जलद तपासण्यासाठी.',
    analyze: 'तपासणी करा',
    analyzing: 'तपासत आहे...',
    clear: 'साफ करा',
    clearAria: 'संदेश साफ करा',
    examplesTitle: 'काय पेस्ट करावे, ते माहित नाही? एक उदाहरण वापरून पहा:',
    examples: [
      { label: 'बँक फसवणूक', text: 'तात्काळ: तुमचे बँक खाते निलंबित केले आहे. तुमचा पासवर्ड त्वरित सत्यापित करण्यासाठी येथे क्लिक करा किंवा तुमचे खाते कायमचे बंद होईल.' },
      { label: 'बक्षीस फसवणूक', text: 'अभिनंदन! तुम्ही $500 चे अमेझॉन गिफ्ट कार्ड जिंकले आहे. खालील लिंकवर क्लिक करून आता तुमचे बक्षीस क्लेम करा. मर्यादित वेळ ऑफर!' },
      { label: 'सुरक्षित संदेश', text: 'हाय आई, मी सारा आहे. आज रात्रीच्या जेवणासाठी मी संध्याकाळी ६ वाजता घरी असेन. तुम्हाला भेटायला उत्सुक आहे!' },
    ],
    threatLabels: {
      Dangerous: 'धोकादायक — संभाव्य फसवणूक',
      Suspicious: 'संशयास्पद — दक्ष रहा',
      Safe: 'सुरक्षित — धोका नाही',
    },
    scamTypePrefix: 'फसवणुकीचा प्रकार:',
    whatWeFound: 'आम्हाला काय सापडले',
    recommendedAction: 'शिफारस केलेली कृती',
    callHelpline: '1930 सायबर हेल्पलाइनला कॉल करा',
    readAloud: 'चेतावणी ऐका',
    stopReading: 'थांबवा',
    footerMain: 'ScamShield — ज्येष्ठ नागरिकांना आणि कुटुंबांना डिजिटल फसवणुकीपासून वाचवणे',
    footerDisclaimer: 'हे साधन सामान्य मार्गदर्शन देते आणि सुरक्षिततेची हमी नाही. नेहमी आपल्या विवेकाचा वापर करा.',
    languageToggleLabel: 'भाषा निवडा',
    langNames: { en: 'English', hi: 'हिन्दी', mr: 'मराठी' },
    scamTypeNames: {
      'Urgency / Phishing': 'तात्काळिकता / फिशिंग',
      'Gift Card / Payment': 'गिफ्ट कार्ड / पेमेंट',
      'Lottery / Prize': 'लॉटरी / बक्षीस',
      'Romance / Impersonation': 'रोमान्स / बनावटी',
    },
    emptyExplanation: 'तपासणीसाठी कोणताही संदेश दिला नाही.',
    emptyAction: 'सुरक्षित आहे का ते तपासण्यासाठी वर एक संदेश पेस्ट करा.',
    dangerousExplanation: (scamType: string) => `या संदेशात ${scamType.toLowerCase()} फसवणुकीत सामान्यपणे वापरले जाणारे नमुने आहेत. फसवणूक करणारे विचार न करता लवकर कृती करण्यासाठी या युक्त्या वापरतात.`,
    dangerousAction: 'कोणत्याही लिंकवर क्लिक करू नका किंवा वैयक्तिक माहिती शेअर करू नका. संदेश डिलीट करा आणि पाठवणाऱ्याला ब्लॉक करा. जर तुम्ही आधीच उत्तर दिले असेल, तर लवकरच तुमच्या बँकेशी संपर्क साधा.',
    suspiciousScamType: 'संभाव्य गोंधळवणारे',
    suspiciousExplanation: 'या संदेशात फसवणुकीत दिसणारी काही चेतावणी चिन्हे आहेत, पण आम्हाला नक्की सांगता येत नाही. यात तुमच्यावर दबाव आणणारी किंवा हेरफेर करणारी भाषा वापरली असू शकते.',
    suspiciousAction: 'दक्ष रहा. वैयक्तिक किंवा आर्थिक माहिती शेअर करू नका. कोणतीही कृती करण्यापूर्वी अधिकृत वाहिनीद्वारे पाठवणाऱ्याची पडताळणी करा.',
    safeScamType: 'काही नाही',
    safeExplanation: 'या संदेशात फसवणुकीचे स्पष्ट संकेत नाहीत. कोणतीही तात्काळिकतेची युक्ती, संवेदनशील माहितीची मागणी, किंवा संशयास्पद लिंक सापडले नाहीत.',
    safeAction: 'तुम्ही पुढे जाऊ शकता, पण नेहमी सतर्क रहा. जर काही वाईट वाटले, तर आपल्या अंतर्मनावर विश्वास ठेवा आणि कुटुंबातील सदस्याकडून मदत घ्या.',
    errorTitle: 'विश्लेषण अयशस्वी',
    errorScamType: 'त्रुटी',
    errorExplanation: 'आम्ही आत्ता तुमचा संदेश विश्लेषित करू शकलो नाही. कृपया तुमचे इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.',
    errorAction: 'जर समस्या टिकून राहिली, तर नंतर पुन्हा प्रयत्न करा किंवा संदेशाचे मूल्यमापन करण्यासाठी तुमच्या विवेकाचा वापर करा.',
  },
};
