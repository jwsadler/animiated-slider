import { useState, useRef, useCallback } from 'react';
import { GooglePlacesService, PlaceSuggestion, PlaceDetails, ParsedAddress } from '../services/googlePlacesService';

interface UseGooglePlacesProps {
  apiKey: string;
  debounceMs?: number;
}

interface UseGooglePlacesReturn {
  // State
  suggestions: PlaceSuggestion[];
  showSuggestions: boolean;
  isLoadingSuggestions: boolean;
  isLoadingDetails: boolean;
  
  // Actions
  searchAddresses: (input: string) => void;
  selectSuggestion: (suggestion: PlaceSuggestion) => Promise<ParsedAddress | null>;
  clearSuggestions: () => void;
  
  // Service instance (for advanced usage)
  placesService: GooglePlacesService;
}

export const useGooglePlaces = ({ 
  apiKey, 
  debounceMs = 300 
}: UseGooglePlacesProps): UseGooglePlacesReturn => {
  // State
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Service instance
  const placesService = useRef(new GooglePlacesService(apiKey)).current;
  
  // Debounce timer
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);

  // Search for address suggestions with debouncing
  const searchAddresses = useCallback((input: string) => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Check if we should perform search
    if (!placesService.shouldPerformSearch(input)) {
      clearSuggestions();
      return;
    }

    // Debounce the API call
    debounceTimer.current = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const results = await placesService.getAddressSuggestions(input);
        
        if (results.length > 0) {
          setSuggestions(results);
          setShowSuggestions(true);
        } else {
          clearSuggestions();
        }
      } catch (error) {
        clearSuggestions();
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, debounceMs);
  }, [placesService, debounceMs, clearSuggestions]);

  // Select a suggestion and get detailed address information
  const selectSuggestion = useCallback(async (suggestion: PlaceSuggestion): Promise<ParsedAddress | null> => {
    try {
      setIsLoadingDetails(true);
      clearSuggestions();

      const placeDetails = await placesService.getPlaceDetails(suggestion.place_id);
      if (!placeDetails) {
        return null;
      }

      const parsedAddress = placesService.parseAddressComponents(placeDetails.address_components);
      return parsedAddress;
    } catch (error) {
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  }, [placesService, clearSuggestions]);

  return {
    // State
    suggestions,
    showSuggestions,
    isLoadingSuggestions,
    isLoadingDetails,
    
    // Actions
    searchAddresses,
    selectSuggestion,
    clearSuggestions,
    
    // Service instance
    placesService,
  };
};
