import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { MinusCircle, PlusCircle, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  selected?: boolean;
  quantity?: number;
};

type FoodRecognitionResultsProps = {
  foods: FoodItem[];
};

export default function FoodRecognitionResults({
  foods,
}: FoodRecognitionResultsProps) {
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  const [recognizedFoods, setRecognizedFoods] = useState(
    foods.map((food) => ({ ...food, selected: true, quantity: 1 }))
  );

  const toggleFoodSelection = (id: string) => {
    setRecognizedFoods(
      recognizedFoods.map((food) =>
        food.id === id ? { ...food, selected: !food.selected } : food
      )
    );
  };

  const updateQuantity = (id: string, increment: boolean) => {
    setRecognizedFoods(
      recognizedFoods.map((food) => {
        if (food.id === id) {
          const newQuantity = increment
            ? Math.min((food.quantity || 1) + 1, 10)
            : Math.max((food.quantity || 1) - 1, 0.5);
          return { ...food, quantity: newQuantity };
        }
        return food;
      })
    );
  };

  const handleSave = () => {
    // In a real app, this would save the selected foods to the user's meal log
    const selectedFoods = recognizedFoods.filter((food) => food.selected);
    console.log('Saving foods to meal log:', selectedFoods);
  };

  // Calculate total nutrition values for selected foods
  const calculateTotals = () => {
    return recognizedFoods
      .filter((food) => food.selected)
      .reduce(
        (totals, food) => {
          const quantity = food.quantity || 1;
          return {
            calories: totals.calories + food.calories * quantity,
            protein: totals.protein + food.protein * quantity,
            carbs: totals.carbs + food.carbs * quantity,
            fat: totals.fat + food.fat * quantity,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
  };

  const totals = calculateTotals();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Recognized Foods
      </Text>

      <View style={styles.foodsList}>
        {recognizedFoods.map((food) => (
          <View
            key={food.id}
            style={[
              styles.foodItem,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.selectionIndicator,
                {
                  backgroundColor: food.selected
                    ? colors.primaryColor
                    : 'transparent',
                  borderColor: food.selected
                    ? colors.primaryColor
                    : colors.borderColor,
                },
              ]}
              onPress={() => toggleFoodSelection(food.id)}
            >
              {food.selected && <Check size={16} color="#FFFFFF" />}
            </TouchableOpacity>

            <View style={styles.foodInfo}>
              <Text style={[styles.foodName, { color: colors.text }]}>
                {food.name}
              </Text>
              <Text style={[styles.confidenceText, { color: colors.text }]}>
                Confidence: {(food.confidence * 100).toFixed(0)}%
              </Text>

              <View style={styles.nutritionInfo}>
                <Text
                  style={[styles.calorieText, { color: colors.calorieColor }]}
                >
                  {Math.round(food.calories * (food.quantity || 1))} kcal
                </Text>
                <View style={styles.macros}>
                  <Text style={[styles.macroText, { color: colors.text }]}>
                    P: {(food.protein * (food.quantity || 1)).toFixed(1)}g
                  </Text>
                  <Text style={[styles.macroText, { color: colors.text }]}>
                    C: {(food.carbs * (food.quantity || 1)).toFixed(1)}g
                  </Text>
                  <Text style={[styles.macroText, { color: colors.text }]}>
                    F: {(food.fat * (food.quantity || 1)).toFixed(1)}g
                  </Text>
                </View>
              </View>
            </View>

            {food.selected && (
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(food.id, false)}
                  disabled={(food.quantity || 1) <= 0.5}
                >
                  <MinusCircle
                    size={24}
                    color={
                      (food.quantity || 1) <= 0.5
                        ? colors.tabIconDefault
                        : colors.text
                    }
                  />
                </TouchableOpacity>

                <Text style={[styles.quantityText, { color: colors.text }]}>
                  {food.quantity || 1}
                </Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(food.id, true)}
                  disabled={(food.quantity || 1) >= 10}
                >
                  <PlusCircle
                    size={24}
                    color={
                      (food.quantity || 1) >= 10
                        ? colors.tabIconDefault
                        : colors.text
                    }
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>

      <View
        style={[styles.totalCard, { backgroundColor: colors.cardBackground }]}
      >
        <Text style={[styles.totalTitle, { color: colors.text }]}>
          Total Nutrition
        </Text>

        <View style={styles.totalNutrition}>
          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: colors.text }]}>
              Calories
            </Text>
            <Text
              style={[styles.nutritionValue, { color: colors.calorieColor }]}
            >
              {Math.round(totals.calories)} kcal
            </Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: colors.text }]}>
              Protein
            </Text>
            <Text
              style={[styles.nutritionValue, { color: colors.proteinColor }]}
            >
              {totals.protein.toFixed(1)}g
            </Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: colors.text }]}>
              Carbs
            </Text>
            <Text style={[styles.nutritionValue, { color: colors.carbsColor }]}>
              {totals.carbs.toFixed(1)}g
            </Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: colors.text }]}>
              Fat
            </Text>
            <Text style={[styles.nutritionValue, { color: colors.fatColor }]}>
              {totals.fat.toFixed(1)}g
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primaryColor }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Add to Today's Log</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  foodsList: {
    gap: 12,
    marginBottom: 16,
  },
  foodItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieText: {
    fontSize: 14,
    fontWeight: '600',
  },
  macros: {
    flexDirection: 'row',
    gap: 8,
  },
  macroText: {
    fontSize: 12,
    opacity: 0.7,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
    width: 24,
    textAlign: 'center',
  },
  totalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  totalNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '40%',
  },
  nutritionLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
