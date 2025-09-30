import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

export interface AuctionItem {
  id: string;
  title: string;
  currentBid: number;
  timeLeft: string;
  imageUrl?: string;
  description: string;
}

export interface AuctionScreenProps {
  // You can add props here for customization
  onBidPress?: (itemId: string) => void;
  onItemPress?: (itemId: string) => void;
}

// Sample auction data
const sampleAuctions: AuctionItem[] = [
  {
    id: '1',
    title: 'Vintage Watch Collection',
    currentBid: 1250,
    timeLeft: '2h 15m',
    description: 'Rare vintage watches from the 1960s',
  },
  {
    id: '2',
    title: 'Modern Art Painting',
    currentBid: 850,
    timeLeft: '5h 42m',
    description: 'Contemporary abstract painting by local artist',
  },
  {
    id: '3',
    title: 'Antique Furniture Set',
    currentBid: 2100,
    timeLeft: '1d 3h',
    description: 'Victorian era dining room set',
  },
];

export const AuctionScreen: React.FC<AuctionScreenProps> = ({
  onBidPress,
  onItemPress,
}) => {
  const handleBidPress = (itemId: string) => {
    onBidPress?.(itemId);
    // Default behavior - you can customize this
    console.log(`Bid pressed for item: ${itemId}`);
  };

  const handleItemPress = (itemId: string) => {
    onItemPress?.(itemId);
    // Default behavior - you can customize this
    console.log(`Item pressed: ${itemId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Auctions</Text>
        <Text style={styles.headerSubtitle}>Bid on exclusive items</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sampleAuctions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.auctionCard}
            onPress={() => handleItemPress(item.id)}
            activeOpacity={0.8}
          >
            {/* Placeholder for image */}
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>📸</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              
              <View style={styles.bidInfo}>
                <View style={styles.bidSection}>
                  <Text style={styles.bidLabel}>Current Bid</Text>
                  <Text style={styles.bidAmount}>${item.currentBid.toLocaleString()}</Text>
                </View>
                
                <View style={styles.timeSection}>
                  <Text style={styles.timeLabel}>Time Left</Text>
                  <Text style={styles.timeLeft}>{item.timeLeft}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.bidButton}
                onPress={() => handleBidPress(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.bidButtonText}>Place Bid</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  auctionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
    opacity: 0.5,
  },
  cardContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bidSection: {
    flex: 1,
  },
  bidLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  bidAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  timeSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  timeLeft: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  bidButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  bidButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuctionScreen;
