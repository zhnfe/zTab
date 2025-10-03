<template>
    <aside class="text-sm px-2 py-5 bg-bg select-none h-full">
        <div class="grid grid-autofill-85 grid-auto-rows-52 gap-x-1.5 gap-y-2">
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
