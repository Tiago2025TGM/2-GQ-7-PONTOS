import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TEAM_MEMBERS } from '../../constants/team';

export default function TeamScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-6 py-4 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Equipe</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-slate-500 mb-6">Conheça o desenvolvedor do BookShelf:</Text>

        {TEAM_MEMBERS.map((member) => (
          <TouchableOpacity
            key={member.id}
            className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex-row items-center"
            onPress={() => router.push(`/team/${member.id}`)}
          >
            <View className="w-14 h-14 rounded-full bg-blue-100 items-center justify-center mr-4">
              <Text className="text-2xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-slate-800">{member.name}</Text>
              <Text className="text-blue-600 text-sm">{member.role}</Text>
              {member.github && (
                <Text className="text-slate-400 text-xs mt-0.5">@{member.github}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
