import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-6">
        <View className="items-center mb-8">
          <Text className="text-6xl mb-4">📚</Text>
          <Text className="text-3xl font-bold text-slate-800">BookShelf</Text>
          <Text className="text-slate-500 mt-1">Versão 1.0.0</Text>
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-slate-800 mb-3">Sobre o App</Text>
          <Text className="text-slate-600 leading-6">
            BookShelf é o seu acervo pessoal de livros. Registre os livros que você leu, está lendo
            ou quer ler, organize por gênero, acompanhe seu progresso de leitura e compartilhe
            suas descobertas literárias.
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-slate-800 mb-3">Funcionalidades</Text>
          {[
            '📖 Catálogo completo de livros',
            '🔍 Busca por título e autor',
            '🏷️ Organização por gêneros',
            '📊 Acompanhamento de progresso',
            '⭐ Avaliação com estrelas',
            '👤 Perfil personalizado',
          ].map((item) => (
            <Text key={item} className="text-slate-600 py-1">{item}</Text>
          ))}
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-slate-800 mb-3">Tecnologias</Text>
          {[
            'React Native + Expo SDK 54',
            'Expo Router (navegação)',
            'Zustand (estado global)',
            'Supabase (backend + auth)',
            'NativeWind (estilização)',
          ].map((item) => (
            <View key={item} className="flex-row items-center py-1">
              <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
              <Text className="text-slate-600">{item}</Text>
            </View>
          ))}
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-slate-800 mb-3">Equipe</Text>
          <Text className="text-slate-600 mb-4">
            Projeto desenvolvido para a disciplina MINF-0005.
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-blue-50 rounded-xl px-4 py-3"
            onPress={() => router.push('/team')}
          >
            <Ionicons name="people-outline" size={20} color="#2563eb" />
            <Text className="text-blue-600 font-medium ml-2">Ver membros da equipe</Text>
            <Ionicons name="chevron-forward" size={16} color="#2563eb" className="ml-auto" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
