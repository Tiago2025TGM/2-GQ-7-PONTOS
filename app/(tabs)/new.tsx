import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useBookStore } from '../../stores/bookStore';
import { useGenreStore } from '../../stores/genreStore';
import { useUIStore } from '../../stores/uiStore';
import BookForm, { type BookFormData } from '../../components/book/BookForm';

export default function NewBookScreen() {
  const user = useAuthStore((s) => s.user);
  const createBook = useBookStore((s) => s.createBook);
  const genres = useGenreStore((s) => s.genres);
  const showToast = useUIStore((s) => s.showToast);

  const handleSubmit = async (data: BookFormData) => {
    if (!user) return;
    try {
      const { genreIds, cover_url, status, rating, notes, total_pages, year_published, ...rest } = data;
      const id = await createBook(user.id, {
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
      showToast('Livro adicionado com sucesso!', 'success');
      router.replace(`/book/${id}`);
    } catch (e: any) {
      showToast(e.message ?? 'Erro ao adicionar livro', 'error');
      throw e;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 py-4 bg-white border-b border-slate-100">
        <Text className="text-xl font-bold text-slate-800">Adicionar Livro</Text>
      </View>
      <BookForm genres={genres} onSubmit={handleSubmit} submitLabel="Adicionar livro" />
    </SafeAreaView>
  );
}
