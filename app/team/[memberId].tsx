import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TEAM_MEMBERS } from '../../constants/team';

export default function TeamMemberScreen() {
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const member = TEAM_MEMBERS.find((m) => m.id === memberId);

  if (!member) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500">Membro não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-6 py-4 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Membro da Equipe</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="items-center py-10 px-6">
          <View className="w-28 h-28 rounded-full bg-blue-100 items-center justify-center mb-4 shadow-sm">
            <Text className="text-5xl">👤</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-800">{member.name}</Text>
          <Text className="text-blue-600 font-medium mt-1">{member.role}</Text>
          {member.github && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="logo-github" size={14} color="#64748b" />
              <Text className="text-slate-500 text-sm ml-1">@{member.github}</Text>
            </View>
          )}
        </View>

        <View className="mx-6 mb-4">
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <Text className="text-base font-semibold text-slate-800 mb-2">Sobre</Text>
            <Text className="text-slate-600 leading-6">{member.bio}</Text>
          </View>

          <View className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">⭐</Text>
              <Text className="text-base font-semibold text-amber-700">Curiosidade</Text>
            </View>
            <Text className="text-amber-700 leading-6">{member.funFact}</Text>
          </View>
        </View>

        <View className="mx-6 mb-8">
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-base font-semibold text-slate-800 mb-3">Contribuição</Text>
            <Text className="text-slate-600 leading-6">
              Responsável pelo design, desenvolvimento front-end e integração com back-end do aplicativo BookShelf,
              desenvolvido para a disciplina MINF-0005.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
