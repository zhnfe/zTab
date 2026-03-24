<template>
    <aside class="py-5 select-none overflow-hidden flex flex-col relative max-h-screen">
        <div class="grid grid-autofill-90 grid-auto-rows-48 gap-2 px-2">
            <FavoriteItem />
        </div>
        <ul class="menu w-full flex-nowrap flex-1 mt-5 overflow-y-auto">
            <li
                v-for="item, index in bookmarks"
                :key="item.id"
            >
                <SideItem
                    :bookmark="item"
                    :indexes="[index]"
                />
            </li>
        </ul>
        <div
            ref="divider"
            class="absolute top-0 h-0.5 opacity-0 ml-4.5 flex items-center"
            style="width: calc(100% - 18px - 8px);"
        >
            <div class="h-2 w-2 rounded-full bg-red-600" />
            <div class="h-full flex-1 bg-red-600" />
        </div>
    </aside>
</template>

<script setup lang="ts">
import { provide, useTemplateRef } from 'vue'
import { bookmarks } from '@/utils/chromeApi'
import FavoriteItem from './FavoriteItem.vue'
import SideItem from './SideItem.vue'

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
