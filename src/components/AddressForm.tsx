import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  FlatList,
  Keyboard,
} from 'react-native';
import { logger } from 'react-native-logs';

const { width } = Dimensions.get('window');
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

// Address interface
export interface Address {
  id?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Google Places API suggestion interface
interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

// Google Places API place details interface
interface PlaceDetails {
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  formatted_address: string;
}

interface AddressFormProps {
  initialAddress?: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
  googlePlacesApiKey: string;
  title?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialAddress,
  onSave,
  onCancel,
  googlePlacesApiKey,
  title = 'New shipping address',
}) => {
  // Form state
  const [address, setAddress] = useState<Address>({
    address1: initialAddress?.address1 || '',
    address2: initialAddress?.address2 || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    postalCode: initialAddress?.postalCode || '',
    country: initialAddress?.country || 'United States',
    isDefault: initialAddress?.isDefault || false,
  });

  // Google Places state
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for input focus management
  const address1Ref = useRef<TextInput>(null);
  const address2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const postalCodeRef = useRef<TextInput>(null);

  // Debounce timer for address lookup
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Google Places API - Get autocomplete suggestions (New API)
  const getAddressSuggestions = async (input: string) => {
    if (!input.trim() || input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoadingSuggestions(true);
      const response = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': googlePlacesApiKey,
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
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } else {
        log.warn('🗺️ [AddressForm] Places API error:', data.error || 'Unknown error');
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      log.error('🗺️ [AddressForm] Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Google Places API - Get place details (New API)
  const getPlaceDetails = async (placeId: string) => {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': googlePlacesApiKey,
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
        log.warn('🗺️ [AddressForm] Place details API error:', data.error || 'Unknown error');
        return null;
      }
    } catch (error) {
      log.error('🗺️ [AddressForm] Error fetching place details:', error);
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Parse address components from Google Places API response
  const parseAddressComponents = (components: PlaceDetails['address_components']) => {
    const parsed = {
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
  };

  // Handle address suggestion selection
  const handleSuggestionSelect = async (suggestion: PlaceSuggestion) => {
    log.debug('🗺️ [AddressForm] Selected suggestion:', suggestion.description);
    
    setShowSuggestions(false);
    setSuggestions([]);
    Keyboard.dismiss();

    const placeDetails = await getPlaceDetails(suggestion.place_id);
    if (!placeDetails) {
      Alert.alert('Error', 'Unable to get address details. Please try again.');
      return;
    }

    const parsed = parseAddressComponents(placeDetails.address_components);
    
    // Construct address1 from street number and route
    const address1 = `${parsed.streetNumber} ${parsed.route}`.trim();
    
    setAddress(prev => ({
      ...prev,
      address1: address1,
      city: parsed.city,
      state: parsed.state,
      postalCode: parsed.postalCode,
      country: parsed.country || 'United States',
    }));

    // Clear any existing errors for auto-filled fields
    setErrors(prev => ({
      ...prev,
      address1: undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined,
    }));
  };

  // Handle address1 input change with debounced API calls
  const handleAddress1Change = (text: string) => {
    setAddress(prev => ({ ...prev, address1: text }));
    
    // Clear address1 error
    if (errors.address1) {
      setErrors(prev => ({ ...prev, address1: undefined }));
    }

    // Debounce API calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      getAddressSuggestions(text);
    }, 300);
  };

  // Handle other input changes
  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    
    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {};

    if (!address.address1.trim()) {
      newErrors.address1 = 'Address is required';
    }

    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!address.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(address.postalCode.trim())) {
      newErrors.postalCode = 'Please enter a valid US postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      log.debug('💾 [AddressForm] Saving address:', address);
      
      // Simulate API call delay
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      
      onSave(address);
    } catch (error) {
      log.error('💾 [AddressForm] Error saving address:', error);
      Alert.alert('Error', 'Unable to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Render suggestion item
  const renderSuggestion = ({ item }: { item: PlaceSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionSelect(item)}
    >
      <Text style={styles.suggestionMainText}>
        {item.structured_formatting.main_text}
      </Text>
      <Text style={styles.suggestionSecondaryText}>
        {item.structured_formatting.secondary_text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Address 1 */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address 1</Text>
          <View style={styles.inputContainer}>
            <TextInput
              ref={address1Ref}
              style={[styles.input, errors.address1 && styles.inputError]}
              placeholder="Enter your address 1"
              placeholderTextColor="#999999"
              value={address.address1}
              onChangeText={handleAddress1Change}
              returnKeyType="next"
              onSubmitEditing={() => address2Ref.current?.focus()}
              autoCapitalize="words"
              autoCorrect={false}
            />
            {isLoadingSuggestions && (
              <ActivityIndicator 
                size="small" 
                color="#007AFF" 
                style={styles.loadingIndicator}
              />
            )}
          </View>
          {errors.address1 && (
            <Text style={styles.errorText}>{errors.address1}</Text>
          )}
        </View>

        {/* Address Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.place_id}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}

        {/* Address 2 (Optional) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address 1 (optional)</Text>
          <TextInput
            ref={address2Ref}
            style={styles.input}
            placeholder="Enter your address 2"
            placeholderTextColor="#999999"
            value={address.address2}
            onChangeText={(text) => handleInputChange('address2', text)}
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current?.focus()}
            autoCapitalize="words"
          />
        </View>

        {/* City */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>City</Text>
          <TextInput
            ref={cityRef}
            style={[styles.input, errors.city && styles.inputError]}
            placeholder="Enter your city"
            placeholderTextColor="#999999"
            value={address.city}
            onChangeText={(text) => handleInputChange('city', text)}
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current?.focus()}
            autoCapitalize="words"
          />
          {errors.city && (
            <Text style={styles.errorText}>{errors.city}</Text>
          )}
        </View>

        {/* State */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>State</Text>
          <TextInput
            ref={stateRef}
            style={[styles.input, errors.state && styles.inputError]}
            placeholder="Enter your state"
            placeholderTextColor="#999999"
            value={address.state}
            onChangeText={(text) => handleInputChange('state', text)}
            returnKeyType="next"
            onSubmitEditing={() => postalCodeRef.current?.focus()}
            autoCapitalize="words"
          />
          {errors.state && (
            <Text style={styles.errorText}>{errors.state}</Text>
          )}
        </View>

        {/* Postal Code */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Postal code</Text>
          <TextInput
            ref={postalCodeRef}
            style={[styles.input, errors.postalCode && styles.inputError]}
            placeholder="Enter your code"
            placeholderTextColor="#999999"
            value={address.postalCode}
            onChangeText={(text) => handleInputChange('postalCode', text)}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            keyboardType="numeric"
            maxLength={10}
          />
          {errors.postalCode && (
            <Text style={styles.errorText}>{errors.postalCode}</Text>
          )}
        </View>

        {/* Country */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Country</Text>
          <View style={styles.countryContainer}>
            <Text style={styles.countryText}>United States</Text>
          </View>
        </View>

        {/* Default Address Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Set as default shipment address</Text>
          <Switch
            value={address.isDefault}
            onValueChange={(value) => handleInputChange('isDefault', value)}
            trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
            thumbColor={address.isDefault ? '#FFFFFF' : '#FFFFFF'}
            ios_backgroundColor="#E0E0E0"
          />
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By providing my shipping information, I agree to the{' '}
            <Text style={styles.termsLink}>Terms of Use</Text> and confirm that the
            information above is correct.
          </Text>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting || isLoadingDetails}
        >
          {isSubmitting || isLoadingDetails ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '300',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  suggestionsContainer: {
    marginBottom: 16,
    marginTop: -16,
  },
  suggestionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionMainText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  suggestionSecondaryText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  countryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  countryText: {
    fontSize: 16,
    color: '#000000',
    fontStyle: 'italic',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
    marginRight: 16,
  },
  termsContainer: {
    marginBottom: 32,
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    textAlign: 'center',
  },
  termsLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressForm;
