# AddressForm Component

A comprehensive React Native address form component with Google Places API integration for US-only address lookup and validation.

## Features

- 🗺️ **Google Places API Integration** - Real-time address suggestions and auto-completion
- 🇺🇸 **US-Only Addresses** - Restricted to United States addresses only
- ✅ **Form Validation** - Built-in validation for all required fields
- 📱 **Mobile Optimized** - Designed specifically for mobile interfaces
- 🎨 **Matches Design** - Styled to match the provided design mockup
- ⚡ **Debounced API Calls** - Optimized API usage with debounced requests
- 🔄 **Loading States** - Visual feedback during API calls
- 📝 **TypeScript Support** - Full TypeScript interfaces and type safety

## Installation

1. Install required dependencies:
```bash
npm install react-native-logs
# or
yarn add react-native-logs
```

2. Get a Google Places API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Places API (New)
     - Geocoding API
   - Create credentials (API Key)
   - Add restrictions for security

## Usage

### Basic Usage

```tsx
import React from 'react';
import AddressForm, { Address } from '../components/AddressForm';

const MyComponent = () => {
  const handleSaveAddress = (address: Address) => {
    console.log('Saved address:', address);
    // Handle address save logic
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    // Handle cancel logic
  };

  return (
    <AddressForm
      onSave={handleSaveAddress}
      onCancel={handleCancel}
      googlePlacesApiKey="YOUR_GOOGLE_PLACES_API_KEY"
      title="New shipping address"
    />
  );
};
```

### With Initial Address (Edit Mode)

```tsx
const existingAddress: Address = {
  id: '1',
  address1: '123 Main St',
  address2: 'Apt 4B',
  city: 'New York',
  state: 'New York',
  postalCode: '10001',
  country: 'United States',
  isDefault: true,
};

return (
  <AddressForm
    initialAddress={existingAddress}
    onSave={handleSaveAddress}
    onCancel={handleCancel}
    googlePlacesApiKey="YOUR_GOOGLE_PLACES_API_KEY"
    title="Edit shipping address"
  />
);
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSave` | `(address: Address) => void` | Yes | Callback when form is submitted successfully |
| `onCancel` | `() => void` | Yes | Callback when form is cancelled |
| `googlePlacesApiKey` | `string` | Yes | Google Places API key |
| `initialAddress` | `Address` | No | Pre-populate form with existing address data |
| `title` | `string` | No | Form title (default: "New shipping address") |

## Address Interface

```tsx
interface Address {
  id?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
```

## Google Places API Setup

### 1. Enable Required APIs

In Google Cloud Console, enable:
- **Places API (New)** - For address autocomplete and details
- **Geocoding API** - For additional geocoding features (optional)

### 2. API Key Restrictions

For security, add these restrictions to your API key:

**Application restrictions:**
- Select "Android apps" and/or "iOS apps"
- Add your app's package name and SHA-1 certificate fingerprint

**API restrictions:**
- Restrict key to specific APIs:
  - Places API (New)
  - Geocoding API (if needed)

### 3. Billing

Google Places API requires billing to be enabled. Check current pricing at [Google Cloud Pricing](https://cloud.google.com/maps-platform/pricing).

## Form Validation

The component includes built-in validation for:

- **Address 1**: Required field
- **City**: Required field  
- **State**: Required field
- **Postal Code**: Required, must match US postal code format (12345 or 12345-6789)
- **Address 2**: Optional field

## Features in Detail

### Address Autocomplete

- Triggers after typing 3+ characters in Address 1 field
- Debounced API calls (300ms delay) to optimize performance
- Shows dropdown with address suggestions
- Auto-fills all fields when suggestion is selected

### Loading States

- Loading indicator in Address 1 field during API calls
- Loading indicator on Confirm button during form submission
- Disabled state for form during address details lookup

### Error Handling

- Network error handling for API calls
- Form validation with inline error messages
- User-friendly error alerts for API failures

### Keyboard Navigation

- Proper tab order between form fields
- "Next" and "Done" return key types
- Auto-focus management between fields

## Styling

The component is styled to match the provided design mockup with:

- Light gray background (`#F5F5F5`)
- White input fields with rounded corners
- Black confirm button
- Proper spacing and typography
- iOS-style switch for default address toggle

## Example Implementation

See `src/examples/AddressFormExample.tsx` for a complete implementation example including:

- Address book management
- Add/Edit/Delete functionality
- Default address handling
- Proper state management

## API Usage Optimization

The component includes several optimizations:

1. **Debounced Requests** - API calls are debounced by 300ms
2. **Minimum Input Length** - Requires 3+ characters before making requests
3. **Request Cancellation** - Cancels previous requests when new ones are made
4. **Error Handling** - Graceful fallback when API calls fail

## Security Considerations

1. **API Key Restrictions** - Always restrict your API key to specific apps/domains
2. **Environment Variables** - Store API keys in environment variables, not in code
3. **Rate Limiting** - Monitor API usage to avoid unexpected charges
4. **Input Validation** - All inputs are validated before submission

## Troubleshooting

### Common Issues

1. **No address suggestions appearing**
   - Check API key is valid and has Places API enabled
   - Verify API key restrictions allow your app
   - Check network connectivity

2. **"OVER_QUERY_LIMIT" error**
   - You've exceeded your API quota
   - Check Google Cloud Console for usage limits

3. **"REQUEST_DENIED" error**
   - API key is invalid or restricted
   - Check API key permissions and restrictions

### Debug Logging

The component includes comprehensive logging. Enable debug logs to troubleshoot:

```tsx
import { logger } from 'react-native-logs';

const log = logger.createLogger({
  severity: 'debug', // Set to 'debug' to see all logs
  transport: logger.consoleTransport,
});
```

## License

This component is part of the animiated-slider project and follows the same license terms.
