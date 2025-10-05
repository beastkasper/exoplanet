import { createContext, useContext } from "react";

type EducationalContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

export const EducationalContext = createContext<EducationalContextType | null>(null);

export function useEducationalContext() {
  const context = useContext(EducationalContext);
  if (!context) {
    throw new Error("useEducationalContext must be used within EducationalLayout");
  }
  return context;
}
