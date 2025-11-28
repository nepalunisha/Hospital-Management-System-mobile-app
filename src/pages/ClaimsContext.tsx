import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";

interface Claim {
  patient: any;
  claimCode: string;
  createdAt: string;
  prescriptionFileName?: string;
  prescriptionFileBase64?: string;
  responseStatus: string;
  outcome: string;
  nmcNumber: string;
  comments: string;
  totalAmount: number;
}

interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Claim) => Promise<void>;
}

const ClaimsContext = createContext<ClaimsContextType>({
  claims: [],
  addClaim: async () => {},
});

export const ClaimsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const loadClaims = async () => {
      const { value } = await Preferences.get({ key: "claims" });
      if (value) setClaims(JSON.parse(value));
    };
    loadClaims();
  }, []);

  const addClaim = async (claim: Claim) => {
    const updatedClaims = [...claims, claim];
    setClaims(updatedClaims);
    await Preferences.set({ key: "claims", value: JSON.stringify(updatedClaims) });
  };

  return (
    <ClaimsContext.Provider value={{ claims, addClaim }}>
      {children}
    </ClaimsContext.Provider>
  );
};

export const useClaims = () => useContext(ClaimsContext);
