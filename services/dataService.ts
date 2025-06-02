// Mock data service for the calorie tracking app
// In a real app, this would connect to a backend API or local storage

// Types
type User = {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  dietType: string;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  fastingSchedule: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    duration: number;
  };
};

type Meal = {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
};

type WeeklyData = {
  calories: {
    day: string;
    consumed: number;
    goal: number;
  }[];
  weight: {
    day: string;
    value: number;
  }[];
  fasting: {
    day: string;
    compliant: boolean;
    hours: number;
  }[];
  calorieDeficit: number;
  weightChange: number;
  fastingCompliance: number;
  averageFastingHours: number;
};

// Mock user data
const mockUser: User = {
  name: 'Alex Johnson',
  age: 32,
  gender: 'male',
  height: 175,
  weight: 82.5,
  activityLevel: 'Moderately Active',
  dietType: 'Low Carb',
  calorieGoal: 2200,
  proteinGoal: 165,
  carbsGoal: 110,
  fatGoal: 85,
  fastingSchedule: {
    enabled: true,
    startTime: '20:00',
    endTime: '12:00',
    duration: 16,
  },
};

// Mock meals data
const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Protein Oatmeal with Berries',
    time: '12:30',
    calories: 420,
    protein: 24,
    carbs: 56,
    fat: 12,
    imageUrl: 'https://images.pexels.com/photos/4916379/pexels-photo-4916379.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    time: '15:45',
    calories: 380,
    protein: 35,
    carbs: 15,
    fat: 18,
    imageUrl: 'https://images.pexels.com/photos/5718071/pexels-photo-5718071.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '3',
    name: 'Protein Shake',
    time: '18:30',
    calories: 220,
    protein: 30,
    carbs: 10,
    fat: 5,
  },
];

// Mock weekly data
const mockWeeklyData: WeeklyData[] = [
  {
    calories: [
      { day: 'Monday', consumed: 2150, goal: 2200 },
      { day: 'Tuesday', consumed: 1980, goal: 2200 },
      { day: 'Wednesday', consumed: 2250, goal: 2200 },
      { day: 'Thursday', consumed: 2050, goal: 2200 },
      { day: 'Friday', consumed: 1900, goal: 2200 },
      { day: 'Saturday', consumed: 2450, goal: 2200 },
      { day: 'Sunday', consumed: 2100, goal: 2200 },
    ],
    weight: [
      { day: 'Monday', value: 82.5 },
      { day: 'Tuesday', value: 82.3 },
      { day: 'Wednesday', value: 82.4 },
      { day: 'Thursday', value: 82.1 },
      { day: 'Friday', value: 82.0 },
      { day: 'Saturday', value: 82.2 },
      { day: 'Sunday', value: 81.9 },
    ],
    fasting: [
      { day: 'Monday', compliant: true, hours: 16 },
      { day: 'Tuesday', compliant: true, hours: 16.5 },
      { day: 'Wednesday', compliant: false, hours: 14 },
      { day: 'Thursday', compliant: true, hours: 16 },
      { day: 'Friday', compliant: true, hours: 17 },
      { day: 'Saturday', compliant: false, hours: 12 },
      { day: 'Sunday', compliant: true, hours: 16 },
    ],
    calorieDeficit: 110,
    weightChange: -0.6,
    fastingCompliance: 0.71,
    averageFastingHours: 15.4,
  },
  {
    calories: [
      { day: 'Monday', consumed: 2300, goal: 2200 },
      { day: 'Tuesday', consumed: 2050, goal: 2200 },
      { day: 'Wednesday', consumed: 2150, goal: 2200 },
      { day: 'Thursday', consumed: 2200, goal: 2200 },
      { day: 'Friday', consumed: 2100, goal: 2200 },
      { day: 'Saturday', consumed: 2500, goal: 2200 },
      { day: 'Sunday', consumed: 2300, goal: 2200 },
    ],
    weight: [
      { day: 'Monday', value: 83.1 },
      { day: 'Tuesday', value: 83.0 },
      { day: 'Wednesday', value: 82.9 },
      { day: 'Thursday', value: 82.8 },
      { day: 'Friday', value: 82.7 },
      { day: 'Saturday', value: 82.8 },
      { day: 'Sunday', value: 82.5 },
    ],
    fasting: [
      { day: 'Monday', compliant: false, hours: 12 },
      { day: 'Tuesday', compliant: true, hours: 16 },
      { day: 'Wednesday', compliant: true, hours: 16 },
      { day: 'Thursday', compliant: true, hours: 16 },
      { day: 'Friday', compliant: true, hours: 16 },
      { day: 'Saturday', compliant: false, hours: 10 },
      { day: 'Sunday', compliant: true, hours: 16 },
    ],
    calorieDeficit: -50,
    weightChange: -0.6,
    fastingCompliance: 0.71,
    averageFastingHours: 14.6,
  },
];

// Service functions
export const getUserData = async (): Promise<User> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser);
    }, 500);
  });
};

export const updateUserData = async (userData: Partial<User>): Promise<User> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would send data to a server or update local storage
      Object.assign(mockUser, userData);
      resolve(mockUser);
    }, 500);
  });
};

export const getTodaysMeals = async (): Promise<Meal[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMeals);
    }, 500);
  });
};

export const addMeal = async (meal: Omit<Meal, 'id'>): Promise<Meal> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMeal = {
        ...meal,
        id: Date.now().toString(),
      };
      mockMeals.push(newMeal);
      resolve(newMeal);
    }, 500);
  });
};

export const getWeeklyData = (weekOffset: number = 0): WeeklyData => {
  // Return data for the requested week (0 = current week, 1 = last week, etc.)
  return mockWeeklyData[weekOffset] || mockWeeklyData[0];
};