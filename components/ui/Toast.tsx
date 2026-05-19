import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useUIStore } from '../../stores/uiStore';

export default function Toast() {
  const { toastMessage, toastType } = useUIStore();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toastMessage) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(2400),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [toastMessage]);

  if (!toastMessage) return null;

  const bgColor =
    toastType === 'success' ? 'bg-green-600'
    : toastType === 'error' ? 'bg-red-600'
    : 'bg-slate-800';

  return (
    <Animated.View
      style={{ opacity }}
      className={`absolute bottom-24 left-6 right-6 rounded-xl px-4 py-3 ${bgColor} shadow-lg z-50`}
    >
      <Text className="text-white text-center font-medium">{toastMessage}</Text>
    </Animated.View>
  );
}
