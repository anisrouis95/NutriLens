// Mock food recognition service
// In a real app, this would call a cloud vision API like Google Vision or Azure Computer Vision

type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
};

// Mock database of food items
const foodDatabase: Record<string, Omit<FoodItem, 'id' | 'confidence'>> = {
  'apple': {
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25.1,
    fat: 0.3,
  },
  'banana': {
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
  },
  'chicken_breast': {
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  'salad': {
    name: 'Mixed Salad',
    calories: 45,
    protein: 2.5,
    carbs: 8,
    fat: 0.5,
  },
  'rice': {
    name: 'White Rice (1 cup)',
    calories: 200,
    protein: 4.2,
    carbs: 44.5,
    fat: 0.4,
  },
  'bread': {
    name: 'Whole Wheat Bread (1 slice)',
    calories: 80,
    protein: 4,
    carbs: 15,
    fat: 1,
  },
  'egg': {
    name: 'Egg',
    calories: 70,
    protein: 6,
    carbs: 0.6,
    fat: 5,
  },
  'avocado': {
    name: 'Avocado (half)',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
  },
  'salmon': {
    name: 'Salmon Fillet',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
  },
  'broccoli': {
    name: 'Broccoli (1 cup)',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
  },
  'sweet_potato': {
    name: 'Sweet Potato',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
  },
  'steak': {
    name: 'Beef Steak',
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 17,
  },
  'pasta': {
    name: 'Pasta (1 cup)',
    calories: 200,
    protein: 7,
    carbs: 40,
    fat: 1.2,
  },
  'yogurt': {
    name: 'Greek Yogurt',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
  },
};

// Mock recognition function
export const recognizeFood = async (imageUri: string): Promise<FoodItem[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, the image would be sent to a vision API
      // Here we just return random food items from our database
      
      // Randomly select 2-4 food items
      const numItems = Math.floor(Math.random() * 3) + 2;
      const foodKeys = Object.keys(foodDatabase);
      const selectedItems: FoodItem[] = [];
      
      // Generate unique random foods
      const selectedKeys = new Set<string>();
      while (selectedKeys.size < numItems) {
        const randomIndex = Math.floor(Math.random() * foodKeys.length);
        selectedKeys.add(foodKeys[randomIndex]);
      }
      
      // Create food items with confidence scores
      selectedKeys.forEach(key => {
        const foodData = foodDatabase[key];
        selectedItems.push({
          id: `${key}_${Date.now()}`,
          ...foodData,
          confidence: 0.5 + Math.random() * 0.5, // Random confidence between 0.5-1.0
        });
      });
      
      // Sort by confidence
      selectedItems.sort((a, b) => b.confidence - a.confidence);
      
      resolve(selectedItems);
    }, 1500);
  });
};

// Function to search for food items by name
export const searchFoodByName = async (query: string): Promise<FoodItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: FoodItem[] = [];
      const normalizedQuery = query.toLowerCase();
      
      Object.entries(foodDatabase).forEach(([key, food]) => {
        if (food.name.toLowerCase().includes(normalizedQuery)) {
          results.push({
            id: `${key}_${Date.now()}`,
            ...food,
            confidence: 1.0, // Manual search always has 100% confidence
          });
        }
      });
      
      resolve(results);
    }, 500);
  });
};