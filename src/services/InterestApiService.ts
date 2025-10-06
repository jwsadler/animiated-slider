import interestsData from '../data/interests.json';

export interface Interest {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export class InterestApiService {
  static fetchInterests(
    onSuccess: (interests: Interest[]) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    onLoading?.(true);

    // Simulate network delay to mimic API behavior
    setTimeout(() => {
      try {
        // Type assertion to ensure the JSON data matches our Interest interface
        const interests: Interest[] = interestsData as Interest[];
        
        onLoading?.(false);
        onSuccess(interests);
      } catch (error) {
        onLoading?.(false);
        onError(error instanceof Error ? error.message : 'Failed to load interests');
      }
    }, 500); // 500ms delay to simulate network request
  }

  // Optional: Method to get a specific interest by ID
  static getInterestById(
    id: string,
    onSuccess: (interest: Interest | null) => void,
    onError: (error: string) => void,
  ) {
    try {
      const interests: Interest[] = interestsData as Interest[];
      const interest = interests.find(item => item.id === id) || null;
      onSuccess(interest);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to find interest');
    }
  }

  // Optional: Method to search interests by name
  static searchInterests(
    query: string,
    onSuccess: (interests: Interest[]) => void,
    onError: (error: string) => void,
  ) {
    try {
      const interests: Interest[] = interestsData as Interest[];
      const filteredInterests = interests.filter(interest =>
        interest.name.toLowerCase().includes(query.toLowerCase()) ||
        (interest.description && interest.description.toLowerCase().includes(query.toLowerCase()))
      );
      onSuccess(filteredInterests);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to search interests');
    }
  }
}
