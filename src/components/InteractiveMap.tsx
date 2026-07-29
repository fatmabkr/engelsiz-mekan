import React from 'react';
import type { Venue } from '../types';
import { GoogleAccessibilityMap, GoogleAccessibilityMapProps } from './GoogleAccessibilityMap';

export interface InteractiveMapProps extends GoogleAccessibilityMapProps {
  venues?: Venue[];
  selectedVenue?: Venue | null;
  onSelectVenue?: (venue: Venue | null) => void;
  onDetailClick?: (venue: Venue) => void;
  onFilterClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = (props) => {
  return <GoogleAccessibilityMap {...props} />;
};

