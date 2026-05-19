import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { useBookStore } from '../../stores/bookStore';
import { useUIStore } from '../../stores/uiStore';
import BookCard from '../../components/book/BookCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

export default function ProfileScreen() {
  const { user, profile, signOut, updateProfile } = useAuthStore();
  const { myBooks, isLoading, fetchMyBooks } = useBookStore();
  const showToast = useUIStore((s) => s.showToast);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(profile?.bio ?? '');

  useEffect(() => {
    if (user) fetchMyBooks(user.id);
  }, [user]);

  const handleSaveBio = async () => {
    try {
      await updateProfile({ bio });
      showToast('Perfil atualizado!', 'success');
      setEditingBio(false);
    } catch {
      showToast('Erro ao atualizar perfil', 'error');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const stats = {
    total: myBooks.length,
    reading: myBooks.filter((b) => b.reading_progress?.[0]?.status === 'reading').length,
    finished: myBooks.filter((b) => b.reading_progress?.[0]?.status === 'finished').length,
    wantToRead: myBooks.filter((b) => !b.reading_progress?.length || b.reading_progress[0]?.status === 'want_to_read').length,
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 pt-6 pb-4 border-b border-slate-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-slate-800">Meu Perfil</Text>
            <TouchableOpacity onPress={handleSignOut} className="flex-row items-center gap-1">
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text className="text-red-500 text-sm font-medium">Sair</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mr-4">
              <Text className="text-3xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-800">{profile?.username ?? '—'}</Text>
              <Text className="text-slate-400 text-sm">{user?.email}</Text>
            </View>
          </View>

          <View className="mt-4">
            {editingBio ? (
              <View>
                <TextInput
                  className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-800 min-h-16"
                  placeholder="Escreva uma bio..."
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  autoFocus
                />
                <View className="flex-row gap-2 mt-2">
                  <TouchableOpacity
                    className="flex-1 py-2 rounded-xl bg-blue-600 items-center"
                    onPress={handleSaveBio}
                  >
                    <Text className="text-white font-medium text-sm">Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-2 rounded-xl bg-slate-100 items-center"
                    onPress={() => { setBio(profile?.bio ?? ''); setEditingBio(false); }}
                  >
                    <Text className="text-slate-600 font-medium text-sm">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingBio(true)} className="flex-row items-start">
                <Text className="flex-1 text-slate-600 text-sm leading-5">
                  {profile?.bio || 'Toque para adicionar uma bio...'}
                </Text>
                <Ionicons name="pencil-outline" size={14} color="#94a3b8" className="mt-0.5 ml-2" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row px-6 py-4 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: 'Lendo', value: stats.reading, color: 'bg-amber-50 text-amber-700' },
            { label: 'Lidos', value: stats.finished, color: 'bg-green-50 text-green-700' },
            { label: 'Lista', value: stats.wantToRead, color: 'bg-slate-100 text-slate-600' },
          ].map((s) => {
            const [bg, txt] = s.color.split(' ');
            return (
              <View key={s.label} className={`flex-1 rounded-xl py-3 items-center ${bg}`}>
                <Text className={`text-xl font-bold ${txt}`}>{s.value}</Text>
                <Text className={`text-xs ${txt}`}>{s.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Books */}
        <View className="px-6 pb-4">
          <Text className="text-base font-semibold text-slate-800 mb-3">Meus livros</Text>
          {isLoading ? (
            <LoadingSpinner />
          ) : myBooks.length === 0 ? (
            <EmptyState icon="📖" title="Nenhum livro ainda" subtitle="Adicione seu primeiro livro!" />
          ) : (
            myBooks.map((book) => <BookCard key={book.id} book={book} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
