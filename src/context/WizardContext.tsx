import type { WasteType } from "../db/wasteRecords";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type WizardState = {
  wasteType: WasteType | null;
  kilograms: string;
  recordedAt: Date;
  addressLabel: string;
  latitude: number | null;
  longitude: number | null;
  photoUri: string | null;
};

const defaultState = (): WizardState => ({
  wasteType: null,
  kilograms: "0.0",
  recordedAt: new Date(),
  addressLabel: "Av. Industrial Norte, 4520",
  latitude: null,
  longitude: null,
  photoUri: null,
});

type WizardContextValue = {
  state: WizardState;
  setWasteType: (t: WasteType) => void;
  setKilograms: (v: string) => void;
  setRecordedAt: (d: Date) => void;
  setAddressLabel: (s: string) => void;
  setGeo: (lat: number | null, lng: number | null) => void;
  setPhotoUri: (uri: string | null) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WizardState>(defaultState);

  const setWasteType = useCallback((wasteType: WasteType) => {
    setState((s) => ({ ...s, wasteType }));
  }, []);

  const setKilograms = useCallback((kilograms: string) => {
    setState((s) => ({ ...s, kilograms }));
  }, []);

  const setRecordedAt = useCallback((recordedAt: Date) => {
    setState((s) => ({ ...s, recordedAt }));
  }, []);

  const setAddressLabel = useCallback((addressLabel: string) => {
    setState((s) => ({ ...s, addressLabel }));
  }, []);

  const setGeo = useCallback((latitude: number | null, longitude: number | null) => {
    setState((s) => ({ ...s, latitude, longitude }));
  }, []);

  const setPhotoUri = useCallback((photoUri: string | null) => {
    setState((s) => ({ ...s, photoUri }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState());
  }, []);

  const value = useMemo(
    () => ({
      state,
      setWasteType,
      setKilograms,
      setRecordedAt,
      setAddressLabel,
      setGeo,
      setPhotoUri,
      reset,
    }),
    [
      state,
      setWasteType,
      setKilograms,
      setRecordedAt,
      setAddressLabel,
      setGeo,
      setPhotoUri,
      reset,
    ]
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
