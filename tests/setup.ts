import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/vue";
import "@testing-library/jest-dom/vitest";
import {
  defineComponent,
  h,
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  nextTick,
} from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Message from "primevue/message";

// Limpa componentes após cada teste
afterEach(() => cleanup());

// Mock do Nuxt auto-imports globais
beforeAll(() => {
  // Auto-imports do Vue que o Nuxt injeta
  Object.assign(globalThis, {
    ref,
    computed,
    reactive,
    watch,
    onMounted,
    nextTick,
  });
});

// Registra globalmente
import { config } from "@vue/test-utils";
config.global.components = {
  NuxtLink: defineComponent({
    name: "NuxtLink",
    props: {
      to: { type: String, required: true },
    },
    render() {
      return h("a", { href: this.to }, this.$slots.default?.());
    },
  }),
  // Componentes PrimeVue auto-imported pelo Nuxt
  InputText,
  Password,
  Button,
  Message,
};

// Mock do Supabase para testes unitários
const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
  },
};

vi.stubGlobal("useSupabaseClient", () => mockSupabaseClient);

// Helper para configurar mock de usuário autenticado
export function mockAuthenticatedUser(email = "test@example.com") {
  const user = ref({ id: "test-user-id", email });
  vi.stubGlobal("useSupabaseUser", () => user);
  return user;
}

// Helper para configurar mock de usuário não autenticado
export function mockUnauthenticatedUser() {
  const user = ref(null);
  vi.stubGlobal("useSupabaseUser", () => user);
  return user;
}

// Helper para resetar mocks entre testes
export function resetSupabaseMocks() {
  mockSupabaseClient.auth.signInWithPassword.mockReset();
  mockSupabaseClient.auth.signOut.mockReset();
}
