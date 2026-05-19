import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { Genre } from '../../types/database';

interface GenrePickerProps {
  genres: Genre[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function GenrePicker({ genres, selectedIds, onChange }: GenrePickerProps) {
  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 py-1">
      {genres.map((g) => {
        const selected = selectedIds.includes(g.id);
        return (
          <TouchableOpacity
            key={g.id}
            onPress={() => toggle(g.id)}
            className={`px-3 py-1.5 rounded-full border ${selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
          >
            <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-600'}`}>
              {g.icon} {g.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
