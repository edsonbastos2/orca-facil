<template>
  <div class="flex min-h-screen">
    <!-- Painel esquerdo: Branding (hidden em mobile) -->
    <div
      class="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white"
    >
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight">Orça Fácil</h1>
        <p class="mt-4 text-lg text-blue-100">
          Crie e gerencie seus orçamentos de forma rápida e profissional.
        </p>
      </div>
    </div>

    <!-- Painel direito: Formulário -->
    <div class="flex w-full items-center justify-center p-6 lg:w-1/2">
      <div class="w-full max-w-md">
        <!-- Logo mobile -->
        <div class="mb-8 text-center lg:hidden">
          <h1 class="text-2xl font-bold text-gray-900">Orça Fácil</h1>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>
