<template>
    <div
        class="grid grid-cols-[1fr_4px]"
        :style="{
            width: `${setting.sidebar.width}px`,
        }"
    >
        <SideBar />
        <div
            class="rounded-full cursor-col-resize hover:bg-primary transition-colors"
            :class="resizerBg"
            @mousedown="handleResize"
        />
    </div>
    <div class="relative rounded-lg" :style="{ backgroundImage: `url(${setting.bgImage})` }">
        <MainSearch />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainSearch from '@/components/MainSearch.vue'
import SideBar from '@/components/SideBar.vue'
import { setting } from '@/store'

const resizerBg = ref<'' | 'bg-primary'>('')
const handleResize = (e: MouseEvent) => {
    resizerBg.value = 'bg-primary'
    const controller = new AbortController()
    const { signal } = controller

    const startX = e.x
    const startWidth = setting.sidebar.width

    window.addEventListener('mousemove', (e) => {
        const dx = e.x - startX
        setting.sidebar.width = startWidth + dx
    }, { signal })

    window.addEventListener('mouseup', () => {
        controller.abort()
        resizerBg.value = ''
    }, { signal })
}
</script>
