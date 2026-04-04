import PrimeVue from "primevue/config";

export function createPrimeVue() {
  return {
    install: (app: any) => {
      app.use(PrimeVue);
    },
  };
}
