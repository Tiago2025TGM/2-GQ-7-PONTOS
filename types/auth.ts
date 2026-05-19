import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from './database';

export type { Session, User };
export type { Profile };

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}
