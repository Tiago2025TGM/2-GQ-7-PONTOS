import { TouchableOpacity, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
}

export default function Chip({ label, selected, onPress, color }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 border ${
        selected
          ? 'bg-blue-600 border-blue-600'
          : 'bg-white border-slate-200'
      }`}
      activeOpacity={0.7}
    >
      <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-600'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
