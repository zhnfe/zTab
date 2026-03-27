<template>
    <aside class="h-screen pt-5 select-none flex flex-col relative">
        <div class="grid grid-autofit-80 grid-auto-rows-48 gap-2 px-2">
            <FavoriteItem />
        </div>
        <ul class="menu w-full flex-nowrap flex-1 mt-5 overflow-y-auto">
            <li
                v-for="item, index in normalBookmarks"
                :key="item.id"
            >
                <SideItem
                    :bookmark="item"
                    :indexes="[index]"
                />
            </li>
            <li ref="scrollSentinel" class="invisible" />
        </ul>
        <footer :class="showFooterShadow ? 'border-t-base-200 border-t' : ''">
            <div class="h-10 y-center px-2 *:p-2 *:leading-none *:cursor-pointer *:rounded-md *:hover:bg-base-300">
                <div class="ml-auto" @click="handleSetup">
                    <IconSettings />
                </div>
            </div>
        </footer>
        <div
            ref="divider"
            class="absolute top-0 h-0.5 opacity-0 ml-4.5 y-center"
            style="width: calc(100% - 18px - 8px);"
        >
            <div class="h-2 w-2 rounded-full bg-red-600" />
            <div class="h-full flex-1 bg-red-600" />
        </div>
        <Modal v-model="setupVisible">
            <Setup />
        </Modal>
    </aside>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, useTemplateRef } from 'vue'
import { normalBookmarks } from '@/utils'
import FavoriteItem from './FavoriteItem.vue'
import Modal from './Modal.vue'
import Setup from './Setup.vue'
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

const showFooterShadow = ref(false)
const scrollSentinel = useTemplateRef('scrollSentinel')

onMounted(() => {
    const observer = new IntersectionObserver(([entry]) => {
        showFooterShadow.value = !entry?.isIntersecting
    })
    observer.observe(scrollSentinel.value!)
})

const setupVisible = ref(false)
const handleSetup = () => {
    setupVisible.value = true
}
</script>
