<template>
    <aside
        class="flex text-sm min-w-40 select-none h-full"
        :style="{
            width: setting.sidebar.width + 'px',
            backgroundColor: setting.sidebar.bgColor
        }"
    >
        <nav class="flex-1 h-full px-2 pt-10 overflow-x-hidden overflow-y-scroll">
            <side-item
                v-for="item in bookmarks"
                :key="item.id"
                :item="item"
            />
        </nav>
        <side-slider />
    </aside>
</template>
<script setup lang="ts">
import { setting } from '@/store'
import { bookmarks } from '@/utils/bookmarks.ts'
import SideSlider from '@/components/SideSlider.vue'
import SideItem from './SideItem.vue'
</script>
