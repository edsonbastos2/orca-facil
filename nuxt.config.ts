// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/supabase", "@primevue/nuxt-module", "@nuxtjs/tailwindcss"],

  supabase: {
    redirect: false,
  },

  primevue: {
    components: {
      include: [
        "Button",
        "InputText",
        "Password",
        "Message",
        "IconField",
        "InputIcon",
        "FloatLabel",
      ],
    },
    options: {
      theme: {
        preset: "aura",
      },
    },
  },
});
