<template>
  <NuxtPage />
</template>

<script setup>
useHead({
  title: "Alexandre Cirilo - Game Reviews",
  meta: [
    {
      name: "description",
      content: "Alexandre Cirilo - Game Reviews",
    },
    {
      name: "lang",
      content: "en",
    },
  ],
})
</script>

<style>
* {
  font-size: 0.9rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (max-width: 480px) {
  * {
    font-size: 0.85rem;
  }
}
</style>
