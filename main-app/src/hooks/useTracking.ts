import { useContext } from 'react';
import { TrackingContext, TrackingContextType } from '../context/Tracking/TrackingContext';

export const useTracking = () : TrackingContextType => {
  const context = useContext(TrackingContext);

  if (!context) { 
    throw new Error('useTracking must be used within a TrackingProvider!'); 
  };

  return context;
};