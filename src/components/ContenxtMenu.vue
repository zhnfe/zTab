<template>
    <div
        class="absolute max-w-100 p-2.5 bg-bg no-offset-shadow-10 rounded-sm text-[13px]"
        :style="{ top: `${position.y}px`,left: `${position.x}px` }"
    >
        <template
            v-for="item, index in items"
            :key="index"
        >
            <div
                class="flex items-center gap-2 rounded-xl hover:bg-primary hover:text-primary-fg cursor-pointer px-3 py-2 min-w-50"
                @click="item.onClick"
                v-if="'title' in item"
            >
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
            </div>
            <hr v-else class="border-gray-200 my-1">
        </template>
    </div>
</template>
<script setup lang="ts">
import type { ContextItem } from '@/utils/commandComponents'

interface Props {
    items: ContextItem[]
    position: {
        x: number
        y: number
    }
}
defineProps<Props>()
const emit = defineEmits(['close'])
document.addEventListener('click', () => emit('close'), { once: true, capture: true })
document.addEventListener('contextmenu', () => emit('close'), { once: true, capture: true })
</script>
