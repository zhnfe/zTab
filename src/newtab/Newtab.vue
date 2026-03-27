<template>
    <div class="relative" :style="{ width: `${sidebarWidth}px` }">
        <SideBar />
        <div
            class="absolute inset-y-3 right-0 w-1 rounded-full cursor-col-resize transition-colors delay-150 hover:bg-info"
            :class="{ 'bg-info': isResizing }"
            @mousedown="handleResize"
        />
    </div>
    <div
        class="relative rounded-lg m-3 ml-0"
        :style="{ background: `var(--color-base-300) url(${newtabBgImage}) center/cover` }"
    >
        <MainSearch />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainSearch from '@/components/MainSearch.vue'
import SideBar from '@/components/SideBar.vue'
import { newtabBgImage, sidebarWidth } from '@/store/setup'

const isResizing = ref(false)

const handleResize = (e: MouseEvent) => {
    isResizing.value = true
    const controller = new AbortController()
    const { signal } = controller

    const startX = e.x
    const startWidth = sidebarWidth.value

    window.addEventListener('mousemove', (e) => {
        sidebarWidth.value = startWidth + (e.x - startX)
    }, { signal })

    window.addEventListener('mouseup', () => {
        controller.abort()
        isResizing.value = false
    }, { signal })
}
</script>
