'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import ThreadLoader from '../components/ThreadLoader';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoader: (duration?: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleShowLoader = (duration = 3000) => {
    setIsLoading(true);
    setShowLoader(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowLoader(false);
    }, duration);
  };

  const handleComplete = () => {
    setIsLoading(false);
    setShowLoader(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        showLoader: handleShowLoader,
      }}
    >
      {showLoader && <ThreadLoader onComplete={handleComplete} />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
