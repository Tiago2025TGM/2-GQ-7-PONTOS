import { create } from 'zustand';
import { supabase } from '../services/supabase';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AuthStore {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Profile, 'username' | 'bio' | 'avatar_url'>>) => Promise<void>;
  clearError: () => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { session, user } = await authService.signIn(email, password);
      let profile = null;
      if (user) profile = await profileService.getProfile(user.id);
      set({ session, user, profile, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  signUp: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      await authService.signUp(email, password, username);
      set({ isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  signOut: async () => {
    await authService.signOut();
    set({ user: null, session: null, profile: null });
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;
    const profile = await profileService.updateProfile(user.id, updates);
    set({ profile });
  },

  clearError: () => set({ error: null }),

  initialize: () => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      const user = session?.user ?? null;
      let profile = null;
      if (user) {
        try { profile = await profileService.getProfile(user.id); } catch {}
      }
      set({ session, user, profile, isLoading: false });
    }).catch(() => {
      set({ isLoading: false });
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      let profile = null;
      if (user) {
        try { profile = await profileService.getProfile(user.id); } catch {}
      }
      set({ session, user, profile });
    });

    return () => listener.subscription.unsubscribe();
  },
}));
