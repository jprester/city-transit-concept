import { useState, type ReactNode } from "react";
import { translations, type Language } from "./translations";
import {
  LanguageContext,
  type LanguageContextType,
} from "./LanguageContextValue";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("hr"); // Default to Croatian

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
