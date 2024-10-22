<template>
  <div class="flex flex-col ml-8 mr-8 h-screen">
    <div class="h-1/8">
      <!-- Title -->
      <div class="flex justify-between items-center gap-3 p-6 mb-6 border-b border-gray-400 border-dashed">
        <div class="flex justify-start items-center">
          <UAvatar class="mr-3" src="https://avatars.githubusercontent.com/u/38657258?v=4" />
          <h1 class="text-xl font-semibold">Game Reviews 🕹️</h1>
        </div>
        <div class="flex justify-end hover:opacity-50 transition-opacity duration-700">
          <!-- Light/dark theme -->
          <button class="theme-toggle" :class="{ 'theme-toggle--toggled': !isDarkTheme }" type="button"
            @click="isDarkTheme = !isDarkTheme">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="2em" height="2em"
              class="theme-toggle__lightbulb" stroke-width="2" stroke="currentColor" fill="currentColor"
              stroke-linecap="round" viewBox="0 0 32 32">
              <path stroke-width="0"
                d="M9.4 9.9c1.8-1.8 4.1-2.7 6.6-2.7 5.1 0 9.3 4.2 9.3 9.3 0 2.3-.8 4.4-2.3 6.1-.7.8-2 2.8-2.5 4.4 0 .2-.2.4-.5.4-.2 0-.4-.2-.4-.5v-.1c.5-1.8 2-3.9 2.7-4.8 1.4-1.5 2.1-3.5 2.1-5.6 0-4.7-3.7-8.5-8.4-8.5-2.3 0-4.4.9-5.9 2.5-1.6 1.6-2.5 3.7-2.5 6 0 2.1.7 4 2.1 5.6.8.9 2.2 2.9 2.7 4.9 0 .2-.1.5-.4.5h-.1c-.2 0-.4-.1-.4-.4-.5-1.7-1.8-3.7-2.5-4.5-1.5-1.7-2.3-3.9-2.3-6.1 0-2.3 1-4.7 2.7-6.5z" />
              <path d="M19.8 28.3h-7.6" />
              <path d="M19.8 29.5h-7.6" />
              <path d="M19.8 30.7h-7.6" />
              <path pathLength="1" class="theme-toggle__lightbulb__coil" fill="none"
                d="M14.6 27.1c0-3.4 0-6.8-.1-10.2-.2-1-1.1-1.7-2-1.7-1.2-.1-2.3 1-2.2 2.3.1 1 .9 1.9 2.1 2h7.2c1.1-.1 2-1 2.1-2 .1-1.2-1-2.3-2.2-2.3-.9 0-1.7.7-2 1.7 0 3.4 0 6.8-.1 10.2" />
              <g class="theme-toggle__lightbulb__rays">
                <path pathLength="1" d="M16 6.4V1.3" />
                <path pathLength="1" d="M26.3 15.8h5.1" />
                <path pathLength="1" d="m22.6 9 3.7-3.6" />
                <path pathLength="1" d="M9.4 9 5.7 5.4" />
                <path pathLength="1" d="M5.7 15.8H.6" />
              </g>
            </svg>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex justify-between items-center gap-3 pl-2">
        <UInput v-model="q" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
        <div class="flex items-center gap-2">
          <USelectMenu v-model="selectedColumns" :options="columns" multiple>
            <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
              Columns
            </UButton>
          </USelectMenu>
          <UButton icon="i-heroicons-arrow-path" color="gray" size="xs" :disabled="q === ''" @click="resetFilters">
            Reset
          </UButton>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-3 mb-3 overflow-y-auto">
      <UTable :rows="rows" :columns="columnsTable">

        <!-- Name -->
        <template #Name-data="{ row }">
          <a :href="row.URL" target="_blank" class="underline">
            {{ row.Name }}
          </a>
        </template>

        <!-- Genre -->
        <template #Genres-data="{ row }">
          <div v-if="row.Genres">
            <span v-for="genre in row.Genres.split(',')" :key="genre" class="pr-2 mb-1 block">
              <UBadge size="xs" :label="genre" :color="getGenreColor(genre)" variant="soft" />
            </span>
          </div>
        </template>

        <!-- Stars -->
        <template #Stars-data="{ row }">
          <UPopover v-if="row.Review" mode="hover">
            <UButton size="xs" icon="i-heroicons-information-circle-20-solid" color="gray" trailing variant="ghost">
              {{ row.Stars }}
            </UButton>
            <template #panel>
              <div class="p-4 w-80 whitespace-pre-wrap text-sm">
                {{ row.Review }}
              </div>
            </template>
          </UPopover>
          <UButton v-else size="xs" color="gray" trailing variant="ghost">
            {{ row.Stars }}
          </UButton>
        </template>

        <!-- Bought -->
        <template #Bought-data="{ row }">
          <UBadge size="xs" :label="row.Bought ? 'Yes' : 'No'" :color="row.Bought ? 'emerald' : 'orange'"
            variant="outline" :ui="uiVariant" />
        </template>

        <!-- Played -->
        <template #Played-data="{ row }">
          <UBadge size="xs" :label="row.Played ? 'Yes' : 'No'" :color="row.Played ? 'emerald' : 'orange'"
            variant="outline" :ui="uiVariant" />
        </template>

        <!-- Store -->
        <template #Store-data="{ row }">
          <div v-if="row.Store">
            <span v-for="store in row.Store.split(',')" :key="store" class="pr-2">
              <UBadge size="xs" :label="store" :color="getStoreColor(store)" variant="solid" />
            </span>
          </div>
        </template>

        <!-- Platforms -->
        <template #Platforms-data="{ row }">
          <div v-if="row.Platforms">
            <span v-for="platform in row.Platforms.split(',')" :key="platform" class="pr-2">
              <UBadge size="xs" :label="platform" color="gray" variant="soft" />
            </span>
          </div>
        </template>
      </UTable>
    </div>

    <div class="h-1/8">
      <!-- Made with ❤️ -->
      <div class="flex justify-between items-center px-3 py-3.5 border-t border-gray-500">
        <p class="text-xs">
          Made with ❤️ by
          <a class="text-xs text-amber-400 hover:underline" href="https://github.com/alxdrcirilo"
            target="_blank">alxdrcirilo</a>
        </p>
        <!-- Game count -->
        <div>
          <span class="text-xs leading-5">
            Showing
            <span class="text-xs">{{ rows.length }}</span>
            games
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import getGenreColor from "~/utils/getGenreColor";
import getPlatformColor from "~/utils/getPlatformColor";
import getStoreColor from "~/utils/getStoreColor";

// Theme
const colorMode = useColorMode();
const isDarkTheme = ref(colorMode.value === "dark" ? true : false);
watch(isDarkTheme, () => {
  colorMode.value = isDarkTheme.value ? "dark" : "light";
});

// Headers
const columns = [{
  key: "Name",
  label: "Name",
  sortable: true,
}, {
  key: "Year",
  label: "Year",
  sortable: true,
}, {
  key: "Genres",
  label: "Genres",
  sortable: false,
}, {
  key: "Rating",
  label: "Rating",
  sortable: true,
}, {
  key: "Playtime",
  label: "Playtime",
  sortable: true,
}, {
  key: "Stars",
  label: "Stars",
  sortable: true,
}, {
  key: "Bought",
  label: "Bought",
  sortable: true,
}, {
  key: "Played",
  label: "Played",
  sortable: true,
}, {
  key: "Store",
  label: "Store",
  sortable: false,
}, {
  key: "Platforms",
  label: "Platforms",
  sortable: false,
}]

// Import games data
import games from "~/content/games.json"

// Sort games by "Name"
games.sort((a, b) => a.Name.localeCompare(b.Name))

// Filtered columns
const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

// Filtered rows
const q = ref("")
const filteredRows = computed(() => {
  if (!q.value) {
    return games
  }

  const query = q.value.toLowerCase()
  return games.filter((game) => game.Name.toLowerCase().includes(query))
})

// TODO: Probably not needed and could just pass filteredRows
const rows = computed(() => filteredRows.value.slice(0, games.length))

// Reset filters
const resetFilters = () => {
  q.value = ""
  selectedStatus.value = []
}

// Custom outline
const uiVariant = { variant: { color: { emerald: { outline: 'ring-emerald-500' } }, orange: { outline: 'ring-orange-500' } } }
</script>

<style>
@import url('~/assets/lightbulb.min.css');

body {
  background-color: #fcf2ec;
  transition: color 0.5s, background-color 0.5s;
}

.dark body {
  background-color: #222222;
  color: #ebf4f1;
}

.dark td {
  border-bottom: 1px solid rgba(252, 242, 236, 0.1);
}
</style>