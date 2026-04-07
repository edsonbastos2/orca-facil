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
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Tag from "primevue/tag";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import PrimeVue from "primevue/config";
import Menubar from "primevue/menubar";
import Breadcrumb from "primevue/breadcrumb";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import ConfirmDialog from "primevue/confirmdialog";
import AppInput from "~/components/atoms/AppInput.vue";
import AppButton from "~/components/atoms/AppButton.vue";

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

  // Mock do matchMedia (necessário para componentes PrimeVue como Select)
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
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
  Select,
  Textarea,
  Tag,
  InputNumber,
  Calendar,
  Menubar,
  Breadcrumb,
  DataTable,
  Column,
  Dialog,
  ConfirmDialog,
  AppInput,
  AppButton,
};

// Mock do PrimeVue config (necessário para componentes PrimeVue v4)
config.global.mocks = {
  $primevue: {
    config: {
      theme: undefined,
      locale: {
        firstDayOfWeek: 0,
      },
      zIndex: {
        overlay: 1000,
        modal: 1100,
        tooltip: 1300,
      },
    },
  },
  $pclocale: {
    firstDayOfWeek: 0,
  },
};

// Plugin global para Vue Test Utils
config.global.plugins = [PrimeVue];

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
