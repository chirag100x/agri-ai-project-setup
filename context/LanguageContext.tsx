"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface LanguageContextType {
  currentLanguage: Language
  availableLanguages: Language[]
  setLanguage: (languageCode: string) => void
  t: (key: string, params?: Record<string, string>) => string
  isRTL: boolean
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
]

// Basic translations - in production, this would come from a translation service
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to AgriAI",
    "chat.placeholder": "Ask me about farming, crops, weather...",
    "weather.title": "Weather Forecast",
    "crops.title": "Crop Recommendations",
    "soil.title": "Soil Analysis",
    "dashboard.title": "Farm Dashboard",
  },
  hi: {
    welcome: "AgriAI में आपका स्वागत है",
    "chat.placeholder": "खेती, फसलों, मौसम के बारे में पूछें...",
    "weather.title": "मौसम पूर्वानुमान",
    "crops.title": "फसल सिफारिशें",
    "soil.title": "मिट्टी विश्लेषण",
    "dashboard.title": "फार्म डैशबोर्ड",
  },
}

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"]

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("agri-ai-language")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage)
      if (language) {
        setCurrentLanguage(language)
      }
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0]
      const detectedLanguage = languages.find((lang) => lang.code === browserLang)
      if (detectedLanguage) {
        setCurrentLanguage(detectedLanguage)
      }
    }
  }, [])

  const setLanguage = (languageCode: string) => {
    const language = languages.find((lang) => lang.code === languageCode)
    if (language) {
      setCurrentLanguage(language)
      localStorage.setItem("agri-ai-language", languageCode)

      // Update document language and direction
      document.documentElement.lang = languageCode
      document.documentElement.dir = RTL_LANGUAGES.includes(languageCode) ? "rtl" : "ltr"
    }
  }

  const t = (key: string, params?: Record<string, string>): string => {
    const languageTranslations = translations[currentLanguage.code] || translations.en
    let translation = languageTranslations[key] || key

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value)
      })
    }

    return translation
  }

  const isRTL = RTL_LANGUAGES.includes(currentLanguage.code)

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        availableLanguages: languages,
        setLanguage,
        t,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
