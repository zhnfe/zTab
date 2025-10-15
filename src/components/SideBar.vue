<template>
    <aside class="text-sm py-5 bg-bg select-none h-full">
        <div class="grid grid-autofill-90 grid-auto-rows-48 gap-2 px-2">
            <favorite-item />
        </div>
        <nav class="flex-1 h-full pt-5 overflow-x-hidden overflow-y-auto relative">
            <side-item
                v-for="item, index in bookmarks"
                :key="item.id"
                :bookmark="item"
                :indexes="[index]"
            />
            <div
                ref="divider"
                class="absolute top-0 h-0.5 opacity-0 ml-4.5 flex items-center"
                style="width: calc(100% - 18px - 8px);"
            >
                <div class="h-2 w-2 rounded-full bg-red-600"></div>
                <div class="h-full flex-1 bg-red-600"></div>
            </div>
        </nav>
    </aside>
</template>
<script setup lang="ts">
import { bookmarks } from '@/utils/chromeApi'
import SideItem from './SideItem.vue'
import FavoriteItem from './FavoriteItem.vue'
import { provide, useTemplateRef } from 'vue'

const divider = useTemplateRef('divider')
provide('handleDevider', (type: 'hide' | 'move', y?: number) => {
    if (!divider.value) {
        return
    }
    if (type === 'hide') {
        divider.value.style.opacity = '0'
        return
    }
    if (type === 'move') {
        divider.value.style.opacity = '1'
        divider.value.style.translate = `0 ${y}px`
    }
})

</script>
