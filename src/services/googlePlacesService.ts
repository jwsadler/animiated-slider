import { logger } from 'react-native-logs';

const log = logger.createLogger({
  severity: 'debug',
  transport: logger.consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
});

// Google Places API suggestion interface
export interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

// Google Places API place details interface
export interface PlaceDetails {
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  formatted_address: string;
}

// Parsed address components
export interface ParsedAddress {
  streetNumber: string;
  route: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export class GooglePlacesService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Check if input should trigger address search
   * Prevents search for:
   * - Empty or short input (< 3 chars)
   * - Input containing only numbers (user hasn't started typing street name)
   */
  shouldPerformSearch(input: string): boolean {
    const trimmedInput = input.trim();
    
    // Must have at least 3 characters
    if (trimmedInput.length < 3) {
      return false;
    }

    // Don't search if input contains only numbers and spaces
    // This prevents searching when user is still typing house number
    const onlyNumbersAndSpaces = /^[\d\s]+$/.test(trimmedInput);
    if (onlyNumbersAndSpaces) {
      return false;
    }

    return true;
  }

  /**
   * Get autocomplete suggestions from Google Places API (New)
   */
  async getAddressSuggestions(input: string): Promise<PlaceSuggestion[]> {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
          },
          body: JSON.stringify({
            input: input,
            locationRestriction: {
              country: 'US'
            },
            includedPrimaryTypes: ['address'],
            languageCode: 'en'
          })
        }
      );

      const data = await response.json();
      
      if (response.ok && data.suggestions) {
        const formattedSuggestions = data.suggestions
          .filter((suggestion: any) => suggestion.placePrediction)
          .map((suggestion: any) => ({
            place_id: suggestion.placePrediction.placeId,
            description: suggestion.placePrediction.text.text,
            structured_formatting: {
              main_text: suggestion.placePrediction.structuredFormat?.mainText?.text || suggestion.placePrediction.text.text,
              secondary_text: suggestion.placePrediction.structuredFormat?.secondaryText?.text || ''
            }
          }));
        
        return formattedSuggestions;
      } else {
        log.warn('🗺️ [GooglePlacesService] Autocomplete API error:', data.error || 'Unknown error');
        return [];
      }
    } catch (error) {
      log.error('🗺️ [GooglePlacesService] Error fetching suggestions:', error);
      return [];
    }
  }

  /**
   * Get place details from Google Places API (New)
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'addressComponents,formattedAddress'
          }
        }
      );

      const data = await response.json();
      
      if (response.ok && data.addressComponents) {
        // Convert new API format to legacy format for compatibility
        const legacyFormat = {
          address_components: data.addressComponents.map((component: any) => ({
            long_name: component.longText,
            short_name: component.shortText,
            types: component.types
          })),
          formatted_address: data.formattedAddress
        };
        return legacyFormat as PlaceDetails;
      } else {
        log.warn('🗺️ [GooglePlacesService] Place details API error:', data.error || 'Unknown error');
        return null;
      }
    } catch (error) {
      log.error('🗺️ [GooglePlacesService] Error fetching place details:', error);
      return null;
    }
  }

  /**
   * Parse address components from Google Places API response
   */
  parseAddressComponents(components: PlaceDetails['address_components']): ParsedAddress {
    const parsed: ParsedAddress = {
      streetNumber: '',
      route: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    };

    components.forEach((component) => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        parsed.streetNumber = component.long_name;
      } else if (types.includes('route')) {
        parsed.route = component.long_name;
      } else if (types.includes('locality')) {
        parsed.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        parsed.state = component.long_name;
      } else if (types.includes('postal_code')) {
        parsed.postalCode = component.long_name;
      } else if (types.includes('country')) {
        parsed.country = component.long_name;
      }
    });

    return parsed;
  }
}
