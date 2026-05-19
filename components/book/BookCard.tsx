import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { Book } from '../../types/database';

const STATUS_LABELS: Record<string, string> = {
  want_to_read: 'Quero ler',
  reading: 'Lendo',
  finished: 'Lido',
};

const STATUS_COLORS: Record<string, string> = {
  want_to_read: 'bg-slate-100 text-slate-600',
  reading: 'bg-blue-100 text-blue-700',
  finished: 'bg-green-100 text-green-700',
};

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const progress = book.reading_progress?.[0];
  const statusKey = progress?.status ?? 'want_to_read';
  const statusStyle = STATUS_COLORS[statusKey] ?? STATUS_COLORS.want_to_read;

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden flex-row"
      onPress={() => router.push(`/book/${book.id}`)}
      activeOpacity={0.75}
    >
      <View style={{ width: 80, alignSelf: 'stretch' }} className="bg-slate-100 items-center justify-center">
        {book.cover_url ? (
          <Image
            source={{ uri: book.cover_url }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            contentFit="cover"
          />
        ) : (
          <Text className="text-3xl">📘</Text>
        )}
      </View>

      <View className="flex-1 p-4">
        <Text className="text-base font-semibold text-slate-800 mb-0.5" numberOfLines={2}>
          {book.title}
        </Text>
        <Text className="text-sm text-slate-500 mb-2">{book.author}</Text>

        <View className="flex-row items-center flex-wrap gap-1">
          <View className={`px-2 py-0.5 rounded-full ${statusStyle.split(' ')[0]}`}>
            <Text className={`text-xs font-medium ${statusStyle.split(' ')[1]}`}>
              {STATUS_LABELS[statusKey]}
            </Text>
          </View>
          {book.genres?.slice(0, 2).map((g) => (
            <View key={g.id} className="px-2 py-0.5 rounded-full bg-slate-100">
              <Text className="text-xs text-slate-500">{g.icon} {g.name}</Text>
            </View>
          ))}
        </View>

        {progress?.rating ? (
          <View className="flex-row mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i} className={`text-xs ${i < (progress.rating ?? 0) ? 'text-amber-400' : 'text-slate-200'}`}>★</Text>
            ))}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
