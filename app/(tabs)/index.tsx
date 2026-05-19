import { useEffect, useCallback } from 'react';
import { View, Text, FlatList, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookStore } from '../../stores/bookStore';
import { useGenreStore } from '../../stores/genreStore';
import { useAuthStore } from '../../stores/authStore';
import BookCard from '../../components/book/BookCard';
import Chip from '../../components/ui/Chip';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function HomeScreen() {
  const profile = useAuthStore((s) => s.profile);
  const { books, isLoading, fetchBooks } = useBookStore();
  const { genres, selectedGenreId, fetchGenres, selectGenre } = useGenreStore();

  useEffect(() => {
    fetchGenres();
    fetchBooks();
  }, []);

  const handleGenreSelect = useCallback(
    (id: string | null) => {
      selectGenre(id);
      fetchBooks(id ? { genreId: id } : undefined);
    },
    [selectGenre, fetchBooks]
  );

  const handleRefresh = useCallback(() => {
    fetchBooks(selectedGenreId ? { genreId: selectedGenreId } : undefined);
  }, [selectedGenreId]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 pt-4 pb-2 bg-white border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-800">
          Olá, {profile?.username ?? 'leitor'} 👋
        </Text>
        <Text className="text-slate-500 text-sm mt-0.5">O que vamos ler hoje?</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-12 min-h-12 bg-white border-b border-slate-100"
        contentContainerClassName="px-6 py-2"
      >
        <Chip
          label="Todos"
          selected={!selectedGenreId}
          onPress={() => handleGenreSelect(null)}
        />
        {genres.map((g) => (
          <Chip
            key={g.id}
            label={`${g.icon} ${g.name}`}
            selected={selectedGenreId === g.id}
            onPress={() => handleGenreSelect(g.id)}
          />
        ))}
      </ScrollView>

      {isLoading && books.length === 0 ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => <BookCard book={item} />}
          contentContainerClassName="px-6 py-4"
          ListEmptyComponent={
            <EmptyState
              icon="📚"
              title="Nenhum livro encontrado"
              subtitle="Seja o primeiro a adicionar um livro!"
            />
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#2563eb" />
          }
        />
      )}
    </SafeAreaView>
  );
}
