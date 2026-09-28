import React, { createContext, useContext } from 'react';
import { type DatabaseApi, useDatabase } from '../hooks/useDatabase';

const AppDataContext = createContext<DatabaseApi | null>(null);

export function AppDataProvider({ children }: {children: React.ReactNode;}) {
  const api = useDatabase();
  return <AppDataContext.Provider value={api}>{children}</AppDataContext.Provider>;
}

export function useAppData(): DatabaseApi {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}