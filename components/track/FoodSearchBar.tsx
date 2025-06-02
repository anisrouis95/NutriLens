import { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Search, Scan } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

export default function FoodSearchBar() {
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // In a real app, this would search a food database
    console.log('Searching for:', searchQuery);
  };

  const handleBarcodeScan = () => {
    // In a real app, this would open a barcode scanner
    console.log('Opening barcode scanner');
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <Search size={20} color={colors.text} style={{ opacity: 0.5 }} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for a food..."
          placeholderTextColor={colors.tabIconDefault}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          onPress={handleBarcodeScan}
          style={styles.barcodeButton}
        >
          <Scan size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 8,
  },
  barcodeButton: {
    padding: 4,
  },
});
