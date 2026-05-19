import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const showToast = useUIStore((s) => s.showToast);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await signIn(data.email, data.password);
      router.replace('/(tabs)/');
    } catch (e: any) {
      showToast(e.message ?? 'Erro ao fazer login', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12">
        <View className="mb-10 items-center">
          <Text className="text-4xl font-bold text-blue-600 mb-2">📚 BookShelf</Text>
          <Text className="text-slate-500 text-base">Seu acervo pessoal de livros</Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-2xl font-bold text-slate-800 mb-6">Entrar</Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1">E-mail</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border rounded-xl px-4 py-3 text-slate-800 bg-slate-50 ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-1">Senha</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border rounded-xl px-4 py-3 text-slate-800 bg-slate-50 ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="••••••••"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
          </View>

          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${submitting ? 'bg-blue-400' : 'bg-blue-600'}`}
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color="white" />
              : <Text className="text-white font-semibold text-base">Entrar</Text>
            }
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-500">Não tem conta? </Text>
          <Link href="/(auth)/signup">
            <Text className="text-blue-600 font-semibold">Criar conta</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
