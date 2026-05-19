import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  acceptTerms: z.literal(true, { error: 'Você deve aceitar os termos' }),
});

type FormData = z.infer<typeof schema>;

export default function SignupScreen() {
  const signUp = useAuthStore((s) => s.signUp);
  const showToast = useUIStore((s) => s.showToast);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { acceptTerms: false as any },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await signUp(data.email, data.password, data.username);
      showToast('Conta criada! Verifique seu e-mail.', 'success');
      router.replace('/(auth)/login');
    } catch (e: any) {
      showToast(e.message ?? 'Erro ao criar conta', 'error');
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
        <View className="mb-8 items-center">
          <Text className="text-4xl font-bold text-blue-600 mb-2">📚 BookShelf</Text>
          <Text className="text-slate-500 text-base">Crie sua conta gratuitamente</Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-2xl font-bold text-slate-800 mb-6">Criar conta</Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-1">Nome de usuário</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border rounded-xl px-4 py-3 text-slate-800 bg-slate-50 ${errors.username ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="seunome"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.username && <Text className="text-red-500 text-xs mt-1">{errors.username.message}</Text>}
          </View>

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

          <View className="mb-5">
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

          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                className="flex-row items-center mb-6"
                onPress={() => onChange(!value)}
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${value ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                  {value && <Text className="text-white text-xs font-bold">✓</Text>}
                </View>
                <Text className="text-slate-600 flex-1 text-sm">
                  Aceito os termos de uso e política de privacidade
                </Text>
              </TouchableOpacity>
            )}
          />
          {errors.acceptTerms && <Text className="text-red-500 text-xs -mt-4 mb-4">{errors.acceptTerms.message}</Text>}

          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${submitting ? 'bg-blue-400' : 'bg-blue-600'}`}
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color="white" />
              : <Text className="text-white font-semibold text-base">Criar conta</Text>
            }
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-500">Já tem conta? </Text>
          <Link href="/(auth)/login">
            <Text className="text-blue-600 font-semibold">Entrar</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
