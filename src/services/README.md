# Interest API Service

This service provides methods to work with interests data using a static JSON file instead of external API calls.

## Features

- **Static Data**: Uses local JSON file for fast, reliable data access
- **Same Interface**: Maintains the same callback-based interface as the original API service
- **Simulated Loading**: Includes artificial delay to mimic network behavior
- **Additional Methods**: Includes bonus methods for searching and finding specific interests

## Usage

### Basic Usage

```typescript
import { InterestApiService, Interest } from './services/InterestApiService';

// Fetch all interests
InterestApiService.fetchInterests(
  (interests: Interest[]) => {
    console.log('Loaded interests:', interests);
  },
  (error: string) => {
    console.error('Error loading interests:', error);
  },
  (loading: boolean) => {
    console.log('Loading state:', loading);
  }
);
```

### Find Interest by ID

```typescript
InterestApiService.getInterestById(
  '1',
  (interest: Interest | null) => {
    if (interest) {
      console.log('Found interest:', interest);
    } else {
      console.log('Interest not found');
    }
  },
  (error: string) => {
    console.error('Error:', error);
  }
);
```

### Search Interests

```typescript
InterestApiService.searchInterests(
  'photo',
  (results: Interest[]) => {
    console.log('Search results:', results);
  },
  (error: string) => {
    console.error('Search error:', error);
  }
);
```

## Data Structure

The service uses the following interface:

```typescript
export interface Interest {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}
```

## Data File

The interests data is stored in `src/data/interests.json` and contains 10 sample interests with:
- Photography
- Cooking
- Hiking
- Reading
- Gaming
- Music
- Fitness
- Travel
- Art & Drawing
- Gardening

Each interest includes an ID, name, description, and image URL from Unsplash.

## Migration from API Service

To migrate from the original API service:

1. Replace the import path to point to the new service
2. No code changes needed - the interface remains the same
3. Remove any API endpoint configurations
4. The service now works offline and loads instantly (with simulated delay)

## Benefits

- ✅ **Offline Support**: Works without internet connection
- ✅ **Fast Loading**: No network latency
- ✅ **Reliable**: No API downtime or rate limiting
- ✅ **Easy Testing**: Consistent data for development and testing
- ✅ **Same Interface**: Drop-in replacement for existing code
