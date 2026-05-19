import { readAsStringAsync } from 'expo-file-system/legacy';
import { supabase } from '../services/supabase';

export async function uploadCoverImage(localUri: string, userId: string): Promise<string> {
  // Read file as base64 — works with file:// URIs on both iOS and Android
  const base64 = await readAsStringAsync(localUri, { encoding: 'base64' });

  // Convert base64 → Uint8Array
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  const uriPath = localUri.split('?')[0];
  const ext = uriPath.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeExt = ext === 'png' ? 'png' : 'jpg';
  const mimeType = safeExt === 'png' ? 'image/png' : 'image/jpeg';
  const path = `${userId}/${Date.now()}.${safeExt}`;

  const { error } = await supabase.storage
    .from('covers')
    .upload(path, bytes, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from('covers').getPublicUrl(path);
  return data.publicUrl;
}
