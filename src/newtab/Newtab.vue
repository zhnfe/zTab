<template>
    <div
        class="relative"
        :style="{
            width: `${sidebarWidth}px`,
        }"
    >
        <SideBar />
        <div
            class="absolute inset-y-3 right-0 w-1 rounded-full cursor-col-resize transition-colors delay-150"
            :class="[resizerBg, `hover:${bg}`]"
            @mousedown="handleResize"
        />
    </div>
    <div class="relative rounded-lg m-3 ml-0" :style="{ background: `var(--color-base-300) url(${newtabBgImage}) center/cover` }">
        <MainSearch />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainSearch from '@/components/MainSearch.vue'
import SideBar from '@/components/SideBar.vue'
import { newtabBgImage, sidebarWidth } from '@/store/setup'

const bg = 'bg-info'
const resizerBg = ref<'' | typeof bg>('')
const handleResize = (e: MouseEvent) => {
    resizerBg.value = bg
    const controller = new AbortController()
    const { signal } = controller

    const startX = e.x
    const startWidth = sidebarWidth.value

    window.addEventListener('mousemove', (e) => {
        const dx = e.x - startX
        sidebarWidth.value = startWidth + dx
    }, { signal })

    window.addEventListener('mouseup', () => {
        controller.abort()
        resizerBg.value = ''
    }, { signal })
}
</script>
