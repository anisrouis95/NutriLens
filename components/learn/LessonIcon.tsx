import {
  Apple,
  Beef,
  BookOpen,
  Brain,
  Calculator,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Hourglass,
  LucideIcon,
  Moon,
  MoonStar,
  Repeat,
  Scale,
  ScanLine,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wheat,
} from 'lucide-react-native';

// Explicit map (instead of importing every icon) keeps the bundle small.
const ICONS: Record<string, LucideIcon> = {
  Apple,
  Beef,
  Brain,
  Calculator,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Hourglass,
  Moon,
  MoonStar,
  Repeat,
  Scale,
  ScanLine,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wheat,
};

export default function LessonIcon({ name, size = 22, color }: { name: string; size?: number; color: string }) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon size={size} color={color} />;
}
