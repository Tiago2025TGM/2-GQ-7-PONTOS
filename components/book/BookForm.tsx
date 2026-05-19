import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import GenrePicker from './GenrePicker';
import { uploadCoverImage } from '../../utils/imageUpload';
import { useAuthStore } from '../../stores/authStore';
import type { Genre, ReadingStatus } from '../../types/database';

const schema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  author: z.string().min(1, 'Autor obrigatório'),
  description: z.string().optional(),
  total_pages: z.string().optional(),
  year_published: z.string().optional(),
  is_public: z.boolean(),
  status: z.enum(['want_to_read', 'reading', 'finished']),
  rating: z.number().min(0).max(5),
  notes: z.string().optional(),
});

export type BookFormData = z.infer<typeof schema> & {
  cover_url?: string | null;
  genreIds?: string[];
};

interface BookFormProps {
  genres: Genre[];
  defaultValues?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  submitLabel?: string;
}

const STATUS_OPTIONS: { value: ReadingStatus; label: string }[] = [
  { value: 'want_to_read', label: 'Quero ler' },
  { value: 'reading', label: 'Lendo' },
  { value: 'finished', label: 'Já li' },
];

export default function BookForm({ genres, defaultValues, onSubmit, submitLabel = 'Salvar' }: BookFormProps) {
  const user = useAuthStore((s) => s.user);
  const [coverUri, setCoverUri] = useState<string | null>(defaultValues?.cover_url ?? null);
  const [coverUrlInput, setCoverUrlInput] = useState(defaultValues?.cover_url ?? '');
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>(defaultValues?.genreIds ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      author: defaultValues?.author ?? '',
      description: defaultValues?.description ?? '',
      total_pages: defaultValues?.total_pages ?? '',
      year_published: defaultValues?.year_published ?? '',
      is_public: defaultValues?.is_public ?? true,
      status: defaultValues?.status ?? 'want_to_read',
      rating: defaultValues?.rating ?? 0,
      notes: defaultValues?.notes ?? '',
    },
  });

  const rating = watch('rating');
  const isPublic = watch('is_public');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para selecionar uma capa.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
      setCoverUrlInput('');
    }
  };

  const effectiveCover = coverUrlInput.trim() || coverUri;

  const handleFormSubmit = async (data: z.infer<typeof schema>) => {
    setSubmitting(true);
    try {
      let finalCoverUrl: string | null = coverUrlInput.trim() || null;

      // Only upload if user picked a local file (not an already-remote URL)
      if (!finalCoverUrl && coverUri && coverUri.startsWith('file://') && user) {
        setUploading(true);
        try {
          finalCoverUrl = await uploadCoverImage(coverUri, user.id);
        } catch (uploadErr: any) {
          Alert.alert('Erro no upload', uploadErr?.message ?? String(uploadErr));
        } finally {
          setUploading(false);
        }
      }

      await onSubmit({
        ...data,
        cover_url: finalCoverUrl,
        genreIds: selectedGenreIds,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
      {/* Cover image */}
      <View className="mx-6 mt-4 items-center">
        <TouchableOpacity onPress={pickImage}>
          {effectiveCover ? (
            <Image source={{ uri: effectiveCover }} style={{ width: 128, height: 192, borderRadius: 12 }} contentFit="cover" />
          ) : (
            <View className="w-32 h-48 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 items-center justify-center">
              <Ionicons name="camera-outline" size={28} color="#94a3b8" />
              <Text className="text-slate-400 text-xs mt-1">Galeria</Text>
            </View>
          )}
        </TouchableOpacity>
        <View className="w-full mt-3">
          <Text className="text-xs text-slate-500 mb-1 text-center">ou cole uma URL de capa</Text>
          <TextInput
            className="border border-slate-200 rounded-xl px-4 py-2 bg-slate-50 text-slate-800 text-sm"
            placeholder="https://..."
            value={coverUrlInput}
            onChangeText={(v) => { setCoverUrlInput(v); if (v) setCoverUri(null); }}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View className="px-6 pt-5">
        {/* Title */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-1">Título *</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border rounded-xl px-4 py-3 bg-slate-50 text-slate-800 ${errors.title ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="Ex: O Senhor dos Anéis"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title.message}</Text>}
        </View>

        {/* Author */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-1">Autor *</Text>
          <Controller
            control={control}
            name="author"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border rounded-xl px-4 py-3 bg-slate-50 text-slate-800 ${errors.author ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="Ex: J.R.R. Tolkien"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.author && <Text className="text-red-500 text-xs mt-1">{errors.author.message}</Text>}
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-1">Descrição</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-800 min-h-20"
                placeholder="Sinopse ou comentário..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>

        {/* Pages + Year */}
        <View className="flex-row mb-4 gap-3">
          <View className="flex-1">
            <Text className="text-sm font-medium text-slate-700 mb-1">Páginas</Text>
            <Controller
              control={control}
              name="total_pages"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-800"
                  placeholder="Ex: 450"
                  keyboardType="number-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-slate-700 mb-1">Ano</Text>
            <Controller
              control={control}
              name="year_published"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-800"
                  placeholder="Ex: 1954"
                  keyboardType="number-pad"
                  maxLength={4}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        </View>

        {/* Genres */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">Gêneros</Text>
          <GenrePicker genres={genres} selectedIds={selectedGenreIds} onChange={setSelectedGenreIds} />
        </View>

        {/* Status */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">Status de leitura</Text>
          <View className="flex-row gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const current = watch('status');
              const active = current === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setValue('status', opt.value)}
                  className={`flex-1 py-2 rounded-xl border items-center ${active ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
                >
                  <Text className={`text-xs font-medium ${active ? 'text-white' : 'text-slate-600'}`}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rating */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">Avaliação</Text>
          <View className="flex-row gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setValue('rating', star === rating ? 0 : star)}>
                <Text className={`text-3xl ${star <= (rating ?? 0) ? 'text-amber-400' : 'text-slate-200'}`}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-1">Notas pessoais</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-800 min-h-16"
                placeholder="Suas impressões sobre o livro..."
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>

        {/* Public toggle */}
        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => setValue('is_public', !isPublic)}
          activeOpacity={0.7}
        >
          <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${isPublic ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
            {isPublic && <Text className="text-white text-xs font-bold">✓</Text>}
          </View>
          <Text className="text-slate-600">Tornar público para outros usuários</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          className={`rounded-xl py-4 items-center mb-8 ${submitting ? 'bg-blue-400' : 'bg-blue-600'}`}
          onPress={handleSubmit(handleFormSubmit)}
          disabled={submitting}
        >
          {submitting
            ? <View className="flex-row items-center gap-2">
                <ActivityIndicator color="white" />
                <Text className="text-white font-medium">{uploading ? 'Enviando imagem…' : 'Salvando…'}</Text>
              </View>
            : <Text className="text-white font-semibold text-base">{submitLabel}</Text>
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
