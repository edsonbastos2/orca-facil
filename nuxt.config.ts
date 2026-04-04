// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/supabase", "@primevue/nuxt-module", "@nuxtjs/tailwindcss"],

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    },
  },

  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: "aura",
      },
    },
  },

  components: [
    { path: "~/components/atoms", pathPrefix: false },
    { path: "~/components/molecules", pathPrefix: false },
    { path: "~/components/organisms", pathPrefix: false },
    { path: "~/components/templates", pathPrefix: false },
  ],

  imports: {
    dirs: ["composables"],
  },
});
