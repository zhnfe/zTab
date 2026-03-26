<template>
    <ul
        class="menu bg-base-200 absolute no-offset-shadow-50 rounded-box"
        :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    >
        <li
            v-for="item, index in items"
            :key="index"
        >
            <div
                v-if="'title' in item"
                class="y-center min-w-50 hover:menu-active"
                @click="item.onClick"
            >
                <component :is="getIcon(item)" />
                <span>{{ item.title }}</span>
            </div>
            <hr v-else class="mx-2 my-1.5 border-base-content/20 hover:bg-none cursor-auto p-0" />
        </li>
    </ul>
</template>

<script setup lang="tsx">
import type { ContextItem } from '@/utils'
import { defineAsyncComponent } from 'vue'

interface Props {
    items: ContextItem[]
    position: {
        x: number
        y: number
    }
}
defineProps<Props>()
const emit = defineEmits(['close'])
const Loading = () => <span class="loading loading-spinner loading-xs"></span>
const getIcon = (item: Extract<ContextItem, { title: string }>) => {
    return defineAsyncComponent({
        loader: item.icon,
        loadingComponent: Loading,
        delay: 0
    })
}
document.addEventListener('click', () => emit('close'), { once: true, capture: true })
document.addEventListener('contextmenu', () => emit('close'), { once: true, capture: true })
</script>
