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
                class="flex rounded-xl hover:bg-primary hover:text-primary-fg cursor-pointer px-3 py-2 min-w-50"
                @click="item.onClick"
                v-if="'title' in item"
            >
                <span class="material-icons-outlined mr-2">{{ item.icon }}</span>
                <span>{{ item.title }}</span>
            </div>
            <hr v-else class="border-gray-200 my-1">
        </template>
    </div>
</template>
<script setup lang="ts">
export type ContextItem = {
    title: string
    icon: string
    onClick: () => void
} | {
    divider: boolean
}
interface Props {
    items: ContextItem[]
    position: {
        x: number
        y: number
    }
}
defineProps<Props>()

const emit = defineEmits(['close'])
document.addEventListener('click', () => emit('close'), { once: true })
document.addEventListener('contextmenu', () => emit('close'), { once: true, capture: true })
</script>
