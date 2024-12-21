<template>
  <div class="flex flex-col ml-8 mr-8 h-screen">
    <div class="h-1/8">
      <!-- Title -->
      <div
        class="flex justify-center p-6 mb-6 border-b border-gray-400 border-dashed"
      >
        <div class="flex items-center">
          <UAvatar
            class="mr-3"
            src="https://avatars.githubusercontent.com/u/38657258?v=4"
          />
          <h1 class="text-xl font-semibold">Game Reviews 🕹️</h1>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex justify-between items-center gap-3 pl-2">
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search..."
        />
        <div class="flex items-center gap-2">
          <USelectMenu v-model="selectedColumns" :options="columns" multiple>
            <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
              Columns
            </UButton>
          </USelectMenu>
          <UButton
            :icon="r ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
            color="gray"
            size="xs"
            @click="r = !r"
          >
            Reviewed
          </UButton>
          <UButton
            icon="i-heroicons-arrow-path"
            color="gray"
            size="xs"
            :disabled="q === ''"
            @click="resetFilters"
          >
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
          <a
            :href="row.URL"
            target="_blank"
            class="text-stone-300 hover:underline"
          >
            <strong>{{ row.Name }}</strong>
          </a>
        </template>

        <!-- Genre -->
        <template #Genres-data="{ row }">
          <div v-if="row.Genres">
            <span
              v-for="genre in row.Genres.split(',')"
              :key="genre"
              class="pr-2"
            >
              <UBadge
                size="xs"
                :label="genre"
                :color="getGenreColor(genre)"
                variant="soft"
              />
            </span>
          </div>
        </template>

        <!-- Stars -->
        <template #Stars-data="{ row }">
          <UPopover mode="hover">
            <UButton
              v-if="row.Stars && row.Review"
              size="xs"
              icon="i-heroicons-information-circle-solid"
              color="gray"
              trailing
              variant="ghost"
            >
              {{ row.Stars }}
            </UButton>
            <UButton
              v-if="row.Stars && !row.Review"
              size="xs"
              color="gray"
              variant="ghost"
            >
              {{ row.Stars }}
            </UButton>
            <div v-if="!row.Stars">
              <UButton size="xs" color="gray" variant="ghost">
                Not rated
              </UButton>
            </div>
            <template #panel>
              <div
                v-if="row.Review"
                class="p-4 w-80 whitespace-pre-wrap text-sm"
              >
                {{ row.Review }}
              </div>
            </template>
          </UPopover>
        </template>

        <!-- Bought -->
        <template #Bought-data="{ row }">
          <div v-if="row.Bought" class="text-xl text-center text-emerald-500">
            ✓
          </div>
          <div v-else class="text-xl text-center text-red-500">✕</div>
        </template>

        <!-- Played -->
        <template #Played-data="{ row }">
          <div v-if="row.Bought" class="text-xl text-center text-emerald-500">
            ✓
          </div>
          <div v-else class="text-xl text-center text-red-500">✕</div>
        </template>

        <!-- Store -->
        <template #Store-data="{ row }">
          <div v-if="row.Store">
            <span
              v-for="store in row.Store.split(',')"
              :key="store"
              class="pr-2"
            >
              <UBadge
                size="xs"
                :label="store"
                :color="getStoreColor(store)"
                variant="soft"
              />
            </span>
          </div>
        </template>

        <!-- Platforms -->
        <template #Platforms-data="{ row }">
          <div v-if="row.Platforms">
            <span
              v-for="platform in row.Platforms.split(',')"
              :key="platform"
              class="pr-2"
            >
              <UBadge
                size="xs"
                :label="platform"
                color="gray"
                variant="solid"
              />
            </span>
          </div>
        </template>
      </UTable>
    </div>

    <div class="h-1/8">
      <!-- Made with ❤️ -->
      <div
        class="flex justify-between items-center px-3 py-3.5 border-t border-gray-500"
      >
        <p class="text-xs">
          Made with ❤️ by
          <a
            class="text-xs text-amber-400 hover:underline"
            href="https://github.com/alxdrcirilo"
            target="_blank"
            >alxdrcirilo</a
          >
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
import { computed, ref } from "vue";
import getGenreColor from "~/utils/getGenreColor";
import getPlatformColor from "~/utils/getPlatformColor";
import getStoreColor from "~/utils/getStoreColor";

// Import games data
import games from "~/content/games.json"

// Columns
const columns = [{
  key: "Name",
  label: "Name",
  sortable: true,
}, {
  key: "Year",
  label: "Year",
  sortable: true,
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
  key: "Store",
  label: "Store",
  sortable: false,
}, {
  key: "Bought",
  label: "Bought",
  sortable: true,
}, {
  key: "Played",
  label: "Played",
  sortable: true,
}, {
  key: "Genres",
  label: "Genres",
  sortable: false,
}, {
  key: "Platforms",
  label: "Platforms",
  sortable: false,
}]

// Sort games by "Name"
games.sort((a, b) => a.Name.localeCompare(b.Name))

// Filtered columns
const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

// Filter rows based on query and reviewed games
const q = ref("")
const r = ref(false)
const reviewedGames = games.filter((game) => game.Review)
const filteredRows = computed(() => {
  // Filter games based on reviewed or not
  const _games = r.value ? reviewedGames : games

  // Filter games based on query
  if (!q.value) {
    return _games
  }

  const query = q.value.toLowerCase()
  return _games.filter((game) => game.Name.toLowerCase().includes(query))
})

// TODO: Probably not needed and could just pass filteredRows
const rows = computed(() => filteredRows.value.slice(0, games.length))

// Reset filters
const resetFilters = () => {
  q.value = ""
  selectedStatus.value = []
}

// Custom outline (previously used in "Bought" and "Played" columns)
// const uiVariant = { variant: { color: { emerald: { outline: 'ring-emerald-500' } }, orange: { outline: 'ring-orange-500' } } }
</script>
