<template>
    <aside class="text-sm py-5 bg-bg select-none h-full">
        <div class="grid grid-autofill-90 grid-auto-rows-48 gap-2 px-2">
            <favorite-item />
        </div>
        <nav class="flex-1 h-full pt-5 overflow-x-hidden overflow-y-auto">
            <side-item
                v-for="item in bookmarks"
                :key="item.id"
                :item="item"
            />
        </nav>
    </aside>
</template>
<script setup lang="ts">
import { bookmarks } from '@/utils/chromeApi'
import SideItem from './SideItem.vue'
import FavoriteItem from './FavoriteItem.vue'
</script>
