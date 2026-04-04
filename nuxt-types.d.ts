// Types for Nuxt auto-imports
// These are resolved at runtime by Nuxt's auto-import system.
// This file exists solely to satisfy vue-tsc.

import type { Ref } from "vue";

declare global {
  function definePageMeta(meta: {
    middleware?: string | string[];
    layout?: string;
    [key: string]: unknown;
  }): void;

  function useHead(meta: { title?: string }): void;

  function navigateTo(to: string): void;

  function useAuthState(): {
    isLoading: Ref<boolean>;
    error: Ref<string | null>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
  };

  function useSupabaseUser(): Ref<{
    id?: string;
    email?: string;
    [key: string]: unknown;
  } | null>;

  function useSupabaseClient(): {
    auth: {
      signInWithPassword: (data: {
        email: string;
        password: string;
      }) => Promise<{ data: { user: unknown | null }; error: unknown | null }>;
      signOut: () => Promise<{ error: unknown | null }>;
    };
  };
}

// This export makes it a proper module
export {};
