import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  label: string;
  icon: string;
  lastFour?: string;
}

export interface PaymentScreenProps {
  onPaymentPress?: (method: PaymentMethod, amount: number) => void;
  onAddPaymentMethod?: () => void;
}

// Sample payment methods
const samplePaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    label: 'Visa ending in 4242',
    icon: '💳',
    lastFour: '4242',
  },
  {
    id: '2',
    type: 'card',
    label: 'Mastercard ending in 8888',
    icon: '💳',
    lastFour: '8888',
  },
  {
    id: '3',
    type: 'paypal',
    label: 'PayPal',
    icon: '🅿️',
  },
  {
    id: '4',
    type: 'apple_pay',
    label: 'Apple Pay',
    icon: '🍎',
  },
];

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  onPaymentPress,
  onAddPaymentMethod,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handlePaymentPress = () => {
    const selectedPaymentMethod = samplePaymentMethods.find(
      method => method.id === selectedMethod
    );
    
    const paymentAmount = parseFloat(amount);
    
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    if (!paymentAmount || paymentAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    onPaymentPress?.(selectedPaymentMethod, paymentAmount);
    
    // Default behavior
    Alert.alert(
      'Payment Initiated',
      `Processing $${paymentAmount.toFixed(2)} via ${selectedPaymentMethod.label}`
    );
  };

  const handleAddPaymentMethod = () => {
    onAddPaymentMethod?.();
    // Default behavior
    Alert.alert('Add Payment Method', 'This would open the add payment method flow');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
        <Text style={styles.headerSubtitle}>Secure and fast transactions</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity
              onPress={handleAddPaymentMethod}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {samplePaymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedMethod === method.id && styles.selectedPaymentMethod,
              ]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.8}
            >
              <View style={styles.paymentMethodContent}>
                <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodLabel}>{method.label}</Text>
                  {method.type === 'card' && (
                    <Text style={styles.paymentMethodSubtext}>
                      Tap to pay • Secure
                    </Text>
                  )}
                </View>
              </View>
              
              {selectedMethod === method.id && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          <View style={styles.transactionCard}>
            <View style={styles.transactionContent}>
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionIconText}>🏆</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Vintage Watch Collection</Text>
                <Text style={styles.transactionSubtext}>Won auction • 2 days ago</Text>
              </View>
            </View>
            <Text style={styles.transactionAmount}>-$1,250.00</Text>
          </View>

          <View style={styles.transactionCard}>
            <View style={styles.transactionContent}>
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionIconText}>💰</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Account Top-up</Text>
                <Text style={styles.transactionSubtext}>Added funds • 1 week ago</Text>
              </View>
            </View>
            <Text style={[styles.transactionAmount, styles.positiveAmount]}>+$500.00</Text>
          </View>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedMethod || !amount) && styles.payButtonDisabled,
          ]}
          onPress={handlePaymentPress}
          disabled={!selectedMethod || !amount}
          activeOpacity={0.8}
        >
          <Text style={styles.payButtonText}>
            {amount ? `Pay $${parseFloat(amount || '0').toFixed(2)}` : 'Enter Amount'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPaymentMethod: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  paymentMethodSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 18,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  transactionSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  positiveAmount: {
    color: '#059669',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  payButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
