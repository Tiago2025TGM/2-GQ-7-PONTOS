import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useBookStore } from '../../stores/bookStore';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STATUS_LABELS: Record<string, string> = {
  want_to_read: 'Quero ler',
  reading: 'Lendo',
  finished: 'Já li',
};

const STATUS_COLORS: Record<string, string> = {
  want_to_read: 'bg-slate-100 text-slate-600',
  reading: 'bg-blue-100 text-blue-700',
  finished: 'bg-green-100 text-green-700',
};

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedBook, isLoading, fetchById, deleteBook } = useBookStore();
  const user = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchById(id);
  }, [id]);

  const isOwner = user && selectedBook?.user_id === user.id;
  const progress = selectedBook?.reading_progress?.[0];
  const statusKey = progress?.status ?? 'want_to_read';

  const handleDelete = () => {
    Alert.alert(
      'Remover livro',
      `Tem certeza que deseja remover "${selectedBook?.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            if (!selectedBook || !user) return;
            setDeleting(true);
            try {
              await deleteBook(selectedBook.id, user.id);
              showToast('Livro removido', 'success');
              router.back();
            } catch (e: any) {
              showToast(e.message ?? 'Erro ao remover', 'error');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading || !selectedBook) return <LoadingSpinner fullScreen />;

  const [statusBg, statusText] = (STATUS_COLORS[statusKey] ?? STATUS_COLORS.want_to_read).split(' ');

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/')}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        {isOwner && (
          <View className="flex-row gap-3">
            <TouchableOpacity onPress={() => router.push(`/book/edit/${selectedBook.id}`)}>
              <Ionicons name="pencil-outline" size={22} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} disabled={deleting}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView className="flex-1">
        <View className="items-center px-6 py-8 bg-white">
          {selectedBook.cover_url ? (
            <Image
              source={{ uri: selectedBook.cover_url }}
              style={{ width: 144, height: 208, borderRadius: 12, marginBottom: 16 }}
              contentFit="cover"
            />
          ) : (
            <View className="w-36 h-52 rounded-xl bg-slate-100 items-center justify-center mb-4">
              <Text className="text-6xl">📘</Text>
            </View>
          )}

          <Text className="text-2xl font-bold text-slate-800 text-center">{selectedBook.title}</Text>
          <Text className="text-slate-500 mt-1 text-center">{selectedBook.author}</Text>

          <View className={`mt-3 px-3 py-1 rounded-full ${statusBg}`}>
            <Text className={`text-sm font-medium ${statusText}`}>{STATUS_LABELS[statusKey]}</Text>
          </View>
        </View>

        <View className="px-6 py-4">
          {/* Genres */}
          {selectedBook.genres && selectedBook.genres.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {selectedBook.genres.map((g) => (
                <View key={g.id} className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                  <Text className="text-sm text-blue-700">{g.icon} {g.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Meta info */}
          <View className="flex-row gap-4 mb-4">
            {selectedBook.total_pages && (
              <View className="items-center bg-white rounded-xl px-4 py-3 flex-1 shadow-sm">
                <Text className="text-lg font-bold text-slate-800">{selectedBook.total_pages}</Text>
                <Text className="text-xs text-slate-500">páginas</Text>
              </View>
            )}
            {selectedBook.year_published && (
              <View className="items-center bg-white rounded-xl px-4 py-3 flex-1 shadow-sm">
                <Text className="text-lg font-bold text-slate-800">{selectedBook.year_published}</Text>
                <Text className="text-xs text-slate-500">publicação</Text>
              </View>
            )}
            {progress?.rating ? (
              <View className="items-center bg-white rounded-xl px-4 py-3 flex-1 shadow-sm">
                <View className="flex-row">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Text key={i} className={`text-base ${i < (progress.rating ?? 0) ? 'text-amber-400' : 'text-slate-200'}`}>★</Text>
                  ))}
                </View>
                <Text className="text-xs text-slate-500">avaliação</Text>
              </View>
            ) : null}
          </View>

          {/* Description */}
          {selectedBook.description && (
            <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <Text className="text-base font-semibold text-slate-800 mb-2">Sinopse</Text>
              <Text className="text-slate-600 leading-6">{selectedBook.description}</Text>
            </View>
          )}

          {/* Notes */}
          {progress?.notes && (
            <View className="bg-amber-50 rounded-2xl p-5 border border-amber-100 mb-4">
              <Text className="text-base font-semibold text-amber-700 mb-2">📝 Minhas notas</Text>
              <Text className="text-amber-700 leading-6">{progress.notes}</Text>
            </View>
          )}

          {/* Added by */}
          <View className="mb-6">
            <Text className="text-xs text-slate-400 text-center">
              Adicionado por {selectedBook.profiles?.username ?? 'usuário'} •{' '}
              {new Date(selectedBook.created_at).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
