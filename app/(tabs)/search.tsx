import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookStore } from '../../stores/bookStore';
import { useDebounce } from '../../hooks/useDebounce';
import BookCard from '../../components/book/BookCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { books, isLoading, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks(debouncedQuery ? { search: debouncedQuery } : undefined);
  }, [debouncedQuery]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-6 py-4 bg-white border-b border-slate-100">
        <Text className="text-xl font-bold text-slate-800 mb-3">Buscar livros</Text>
        <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3 gap-2">
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 text-slate-800"
            placeholder="Título ou autor..."
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Ionicons name="close-circle" size={18} color="#94a3b8" onPress={() => setQuery('')} />
          )}
        </View>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => <BookCard book={item} />}
          contentContainerClassName="px-6 py-4"
          ListEmptyComponent={
            query.length > 0
              ? <EmptyState icon="🔍" title="Sem resultados" subtitle={`Nenhum livro encontrado para "${query}"`} />
              : <EmptyState icon="📚" title="Busque livros" subtitle="Digite um título ou nome de autor" />
          }
        />
      )}
    </SafeAreaView>
  );
}
