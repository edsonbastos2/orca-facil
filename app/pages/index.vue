<script setup lang="ts">
const user = useSupabaseUser()

if (user.value) {
  navigateTo('/dashboard')
} else {
  navigateTo('/login')
}
</script>

<template>
  <div />
</template>
