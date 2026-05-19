import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    session: state.session,
    profile: state.profile,
    isLoading: state.isLoading,
    error: state.error,
    signIn: state.signIn,
    signUp: state.signUp,
    signOut: state.signOut,
    updateProfile: state.updateProfile,
    clearError: state.clearError,
  }));
}
