import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookStore } from '../../../stores/bookStore';
import { useAuthStore } from '../../../stores/authStore';
import { useGenreStore } from '../../../stores/genreStore';
import { useUIStore } from '../../../stores/uiStore';
import BookForm, { type BookFormData } from '../../../components/book/BookForm';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedBook, isLoading, fetchById, updateBook } = useBookStore();
  const user = useAuthStore((s) => s.user);
  const genres = useGenreStore((s) => s.genres);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    if (id) fetchById(id);
  }, [id]);

  const handleSubmit = async (data: BookFormData) => {
    if (!selectedBook || !user) return;
    try {
      const { genreIds, cover_url, status, rating, notes, total_pages, year_published, ...rest } = data;
      await updateBook(selectedBook.id, user.id, {
        ...rest,
        cover_url,
        total_pages: total_pages ? parseInt(total_pages) : null,
        year_published: year_published ? parseInt(year_published) : null,
        genreIds,
        progress: {
          status: status ?? 'want_to_read',
          rating: rating || null,
          notes: notes || null,
        },
      });
      showToast('Livro atualizado!', 'success');
      router.back();
    } catch (e: any) {
      showToast(e.message ?? 'Erro ao atualizar', 'error');
      throw e;
    }
  };

  if (isLoading || !selectedBook) return <LoadingSpinner fullScreen />;

  const progress = selectedBook.reading_progress?.[0];

  const defaultValues: Partial<BookFormData> = {
    title: selectedBook.title,
    author: selectedBook.author,
    description: selectedBook.description ?? '',
    total_pages: selectedBook.total_pages?.toString() ?? '',
    year_published: selectedBook.year_published?.toString() ?? '',
    is_public: selectedBook.is_public,
    cover_url: selectedBook.cover_url,
    genreIds: selectedBook.genres?.map((g) => g.id) ?? [],
    status: progress?.status ?? 'want_to_read',
    rating: progress?.rating ?? 0,
    notes: progress?.notes ?? '',
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-6 py-4 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/')} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Editar Livro</Text>
      </View>
      <BookForm
        genres={genres}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Salvar alterações"
      />
    </SafeAreaView>
  );
}
