<template>
    <div
        ref="el"
        class="cursor-col-resize w-1 opacity-0 hover:opacity-25 bg-black my-1.5 rounded-sm"
        @mousedown="handleMouseDown"
    ></div>
</template>
<script setup lang="ts">
import { setting } from '@/store'
import { reactive, useTemplateRef } from 'vue'

const mouseState = reactive({
    isDown: false,
    startX: 0
})
const el = useTemplateRef('el')

const handleMouseDown = (e: MouseEvent) => {
    document.body.style.cursor = 'col-resize'
    if (el.value) {
        el.value.style.opacity = '0.25'
    }
    mouseState.isDown = true
    mouseState.startX = e.clientX
}
const handleMouseMove = (e: MouseEvent) => {
    if (mouseState.isDown) {
        setting.sidebar.width = e.clientX
    }
}
const handleMouseUp = () => {
    if (!mouseState.isDown) {
        return
    }
    if (el.value) {
        el.value.style.opacity = ''
    }
    document.body.style.cursor = 'auto'
    mouseState.isDown = false
}
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
</script>
