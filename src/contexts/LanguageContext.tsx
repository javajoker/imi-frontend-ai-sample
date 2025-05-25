import React, { createContext, useContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";

// Available languages
export const LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  "zh-TW": {
    code: "zh-TW",
    name: "Traditional Chinese",
    nativeName: "繁體中文",
    flag: "🇭🇰",
  },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

interface LanguageContextType {
  currentLanguage: LanguageCode;
  changeLanguage: (language: LanguageCode) => void;
  availableLanguages: typeof LANGUAGES;
  t: (key: string, options?: any) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode | ReactNode[];
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: LanguageCode) => {
    i18n.changeLanguage(language);
    localStorage.setItem("preferred-language", language);

    // Update document attributes for RTL support
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr"; // language === "ar" ? "rtl" : "ltr";
  };

  const value: LanguageContextType = {
    currentLanguage: i18n.language as LanguageCode,
    changeLanguage,
    availableLanguages: LANGUAGES,
    t,
    isRTL: i18n.language === "ar", // Add more RTL languages as needed
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
