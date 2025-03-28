import { createContext, useContext, useEffect, useState } from "react";

interface Currency {
  custom: boolean;
  symbol: string;
  code: string;
}

interface Settings {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
}

const SettingsContext = createContext<Settings | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultCurrency: Currency = { custom: false, symbol: "$", code: "USD" };
  const defaultPrimaryColor = "#D5232C";
  const defaultDateFormat = "PPP";

  const [currency, setCurrency] = useState<Currency>(() => {
    const stored = localStorage.getItem("currency");
    return stored ? JSON.parse(stored) : defaultCurrency;
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    const stored = localStorage.getItem("primaryColor");
    return stored || defaultPrimaryColor;
  });

  const [dateFormat, setDateFormat] = useState(() => {
    const stored = localStorage.getItem("dateFormat");
    return stored || defaultDateFormat;
  });

  useEffect(() => {
    localStorage.setItem("currency", JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("primaryColor", primaryColor);
    document.documentElement.style.setProperty("--primary", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem("dateFormat", dateFormat);
  }, [dateFormat]);

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, primaryColor, setPrimaryColor, dateFormat, setDateFormat }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
