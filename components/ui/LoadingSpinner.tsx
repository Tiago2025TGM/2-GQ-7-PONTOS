import { View, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({ fullScreen }: LoadingSpinnerProps) {
  return (
    <View className={`items-center justify-center ${fullScreen ? 'flex-1' : 'py-10'}`}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}
