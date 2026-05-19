import { View, Text } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = '📭', title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-xl font-semibold text-slate-700 text-center">{title}</Text>
      {subtitle && (
        <Text className="text-slate-400 text-center mt-2 px-8">{subtitle}</Text>
      )}
    </View>
  );
}
