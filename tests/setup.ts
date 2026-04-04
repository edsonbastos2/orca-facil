import { afterAll, afterEach, beforeAll } from "vitest";
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
