<template>
    <div
        class="grid grid-cols-[1fr_4px]"
        :style="{
            width: `${setting.sidebar.width}px`,
        }"
    >
        <SideBar />
        <div ref="sidebarResizer" class="rounded-full cursor-col-resize grow-0 hover:bg-amber-200 transition-all" />
    </div>
    <div class="rounded-md flex justify-center items-center" :style="{ backgroundImage: `url(${setting.bgImage})` }">
        <MainSearch />
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import MainSearch from '@/components/MainSearch.vue'
import SideBar from '@/components/SideBar.vue'
import { setting } from '@/store'

const resizer = useTemplateRef('sidebarResizer')
const resizeSidebar = () => {
    if (!resizer.value) return

    resizer.value.addEventListener('mousedown', (e) => {
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
        }, { signal })
    })
}
onMounted(() => {
    resizeSidebar()
})
</script>
