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

  // Method to save selected interests to middleware
  static saveSelectedInterests(
    selectedInterests: Interest[],
    onSuccess: (response: { message: string; savedCount: number }) => void,
    onError: (error: string) => void,
    onLoading?: (loading: boolean) => void,
  ) {
    onLoading?.(true);

    // Validate input
    if (!selectedInterests || selectedInterests.length === 0) {
      onLoading?.(false);
      onError('No interests selected to save');
      return;
    }

    // Prepare payload for middleware
    const payload = {
      selectedInterests: selectedInterests.map(interest => ({
        id: interest.id,
        name: interest.name,
        description: interest.description,
        imageUrl: interest.imageUrl,
      })),
      timestamp: new Date().toISOString(),
      userId: 'current-user-id', // This would typically come from auth context
    };

    // Simulate API call to middleware
    setTimeout(() => {
      try {
        // Simulate different response scenarios
        const shouldSucceed = Math.random() > 0.1; // 90% success rate for demo

        if (shouldSucceed) {
          const response = {
            message: 'Selected interests saved successfully',
            savedCount: selectedInterests.length,
          };
          onLoading?.(false);
          onSuccess(response);
        } else {
          // Simulate server error
          throw new Error('Server temporarily unavailable. Please try again.');
        }
      } catch (error) {
        onLoading?.(false);
        onError(error instanceof Error ? error.message : 'Failed to save selected interests');
      }
    }, 1000); // 1 second delay to simulate network request

    // In a real implementation, this would be:
    /*
    fetch('https://your-middleware-api.com/api/user/interests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // From auth context
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        onLoading?.(false);
        onSuccess({
          message: data.message || 'Selected interests saved successfully',
          savedCount: selectedInterests.length,
        });
      })
      .catch(error => {
        onLoading?.(false);
        onError(error.message || 'Failed to save selected interests');
      });
    */
  }
}
