import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AddressForm, { Address } from '../components/AddressForm';

const AddressFormExample: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();

  // Replace with your actual Google Places API key
  const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY_HERE';

  const handleSaveAddress = (address: Address) => {
    if (editingAddress) {
      // Update existing address
      setSavedAddresses(prev => 
        prev.map(addr => 
          addr.id === editingAddress.id 
            ? { ...address, id: editingAddress.id }
            : addr
        )
      );
      Alert.alert('Success', 'Address updated successfully!');
    } else {
      // Add new address
      const newAddress = {
        ...address,
        id: Date.now().toString(), // Simple ID generation
      };
      setSavedAddresses(prev => [...prev, newAddress]);
      Alert.alert('Success', 'Address saved successfully!');
    }
    
    setShowForm(false);
    setEditingAddress(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(undefined);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
          },
        },
      ]
    );
  };

  const renderAddressCard = (address: Address) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressTitle}>
          {address.isDefault ? 'Default Address' : 'Shipping Address'}
        </Text>
        {address.isDefault && <View style={styles.defaultBadge} />}
      </View>
      
      <Text style={styles.addressText}>
        {address.address1}
        {address.address2 ? `, ${address.address2}` : ''}
      </Text>
      <Text style={styles.addressText}>
        {address.city}, {address.state} {address.postalCode}
      </Text>
      <Text style={styles.addressText}>{address.country}</Text>
      
      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditAddress(address)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAddress(address.id!)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (showForm) {
    return (
      <AddressForm
        initialAddress={editingAddress}
        onSave={handleSaveAddress}
        onCancel={handleCancelForm}
        googlePlacesApiKey={GOOGLE_PLACES_API_KEY}
        title={editingAddress ? 'Edit shipping address' : 'New shipping address'}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Address Book</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addButtonText}>+ Add Address</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {savedAddresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No addresses saved</Text>
            <Text style={styles.emptySubtitle}>
              Add your first shipping address to get started
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowForm(true)}
            >
              <Text style={styles.emptyButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.addressList}>
            {savedAddresses.map(renderAddressCard)}
          </View>
        )}

        {/* API Key Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>⚠️ Setup Required</Text>
          <Text style={styles.noticeText}>
            To use Google Places API integration, you need to:
          </Text>
          <Text style={styles.noticeStep}>
            1. Get a Google Places API key from Google Cloud Console
          </Text>
          <Text style={styles.noticeStep}>
            2. Enable Places API and Geocoding API
          </Text>
          <Text style={styles.noticeStep}>
            3. Replace GOOGLE_PLACES_API_KEY in this example
          </Text>
          <Text style={styles.noticeStep}>
            4. Add API key restrictions for security
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addressList: {
    gap: 16,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  defaultBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  addressActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  noticeContainer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 8,
  },
  noticeStep: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
    paddingLeft: 8,
  },
});

export default AddressFormExample;
