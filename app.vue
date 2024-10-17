<template>
  <Table />
</template>

<script setup>
import Table from "~/components/Table.vue"

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
}

body {
  font-family: "SFMono-Regular", "Consolas", "Liberation Mono", "Menlo", "Courier", "monospace";
}
</style>
