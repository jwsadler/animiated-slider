import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaymentScreen, StripeConfig } from '../src/components/PaymentScreen';

// Example Stripe configuration
// Replace with your actual Stripe publishable key
const stripeConfig: StripeConfig = {
  publishableKey: 'pk_test_51234567890abcdef...', // Your Stripe publishable key
  merchantIdentifier: 'merchant.com.yourapp', // Optional: for Apple Pay
  urlScheme: 'your-app-scheme', // Optional: for redirects
};

const StripePaymentExample: React.FC = () => {
  // This function should call your backend to create a PaymentIntent
  const handleStripePayment = async (amount: number): Promise<{ clientSecret: string }> => {
    try {
      // Example API call to your backend
      const response = await fetch('https://your-backend.com/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-auth-token', // If needed
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          // Add any other required fields
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return { clientSecret: data.client_secret };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  const handlePaymentPress = (method: any, amount: number) => {
    Alert.alert(
      'Payment Method Selected',
      `Selected: ${method.label}\nAmount: $${amount.toFixed(2)}`
    );
  };

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'This would open your add payment method flow');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <PaymentScreen
          onPaymentPress={handlePaymentPress}
          onAddPaymentMethod={handleAddPaymentMethod}
          onStripePayment={handleStripePayment}
          stripeConfig={stripeConfig}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

export default StripePaymentExample;
