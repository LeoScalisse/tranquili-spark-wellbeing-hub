
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface EventData {
  [key: string]: any;
}

interface EventSystemContextType {
  emit: (eventName: string, data?: EventData) => void;
  subscribe: (eventName: string, callback: (data?: EventData) => void) => () => void;
}

const EventSystemContext = createContext<EventSystemContextType | undefined>(undefined);

export const useEventSystem = () => {
  const context = useContext(EventSystemContext);
  if (!context) {
    throw new Error('useEventSystem must be used within EventSystemProvider');
  }
  return context;
};

interface EventSystemProviderProps {
  children: ReactNode;
}

export const EventSystemProvider = ({ children }: EventSystemProviderProps) => {
  const [listeners, setListeners] = useState<Record<string, ((data?: EventData) => void)[]>>({});

  const emit = useCallback((eventName: string, data?: EventData) => {
    console.log(`🎯 Evento emitido: ${eventName}`, data);
    const eventListeners = listeners[eventName] || [];
    eventListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erro ao processar evento ${eventName}:`, error);
      }
    });
  }, [listeners]);

  const subscribe = useCallback((eventName: string, callback: (data?: EventData) => void) => {
    setListeners(prev => ({
      ...prev,
      [eventName]: [...(prev[eventName] || []), callback]
    }));

    // Retorna função de cleanup
    return () => {
      setListeners(prev => ({
        ...prev,
        [eventName]: (prev[eventName] || []).filter(cb => cb !== callback)
      }));
    };
  }, []);

  const value = {
    emit,
    subscribe
  };

  return (
    <EventSystemContext.Provider value={value}>
      {children}
    </EventSystemContext.Provider>
  );
};
