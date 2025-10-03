<template>
    <div
        class="leading-none mb-1 p-2.5 pr-1 hover:bg-primary hover:text-primary-fg rounded-xl
            cursor-pointer nav-item-shadow
            flex gap-x-2.5
        "
        @click="handleClick(item)"
        @contextmenu="(e) => handleSideBarMenu(e, item)"
    >
        <div class="w-3.5 aspect-square flex-none rounded-xs overflow-hidden">
            <span v-if="isFolderItem" class="material-icons-outlined">folder</span>
            <img
                v-else
                :src="getFavicon(item.url)"
                @error="handleIconLoadedError"
            >
        </div>
        <div class="h-auto line-clamp-1">{{ item.title }}</div>
    </div>
    <transition
        enter-active-class="transition-all duration-200 ease-out"
        :enter-from-class="beginClass"
        :enter-to-class="endClass"
        leave-active-class="transition-all duration-200 ease-out"
        :leave-from-class="endClass"
        :leave-to-class="beginClass"
    >
        <div
            v-if="showChildren && hasChildren"
            class="grid overflow-hidden ml-3"
        >
            <div class="min-h-0">
                <side-item
                    v-for="child in item.children"
                    :key="child.id"
                    :item="child"
                    :deepth="deepth + 1"
                />
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { getFavicon, useContextMenu } from '@/utils'
import { generateContextMenuItems } from '@/utils/chromeApi'
import { isBookmarkFolder } from '@/utils/chromeApi'
import type { BookmarkNode } from '@/utils/serviceWorker'
import { computed, ref } from 'vue'
const beginClass = 'grid-rows-[0fr]'
const endClass = 'grid-rows-[1fr]'
interface Props {
    item: BookmarkNode
    deepth?: number
}
const props = withDefaults(defineProps<Props>(), {
    deepth: 1
})
const isFolderItem = isBookmarkFolder(props.item)
const showChildren = ref(false)
const hasChildren = computed(() => {
    return !!props.item.children?.length
})

const handleIconLoadedError = (e: Event) => {
    // bg-[#b08c4b]
    const target = e.target as HTMLImageElement
    target.parentElement!.style.backgroundColor = '#b08c4b'
    target.remove()
}
const handleClick = (item: chrome.bookmarks.BookmarkTreeNode) => {
    if (isFolderItem) {
        showChildren.value = !showChildren.value
        return
    }
    chrome.tabs.create({ url: item.url })
}
const handleSideBarMenu = (e: PointerEvent, item: chrome.bookmarks.BookmarkTreeNode) => {
    e.preventDefault()
    e.stopPropagation()
    const { pageX, pageY } = e
    useContextMenu({ x: pageX, y: pageY }, generateContextMenuItems(item))
}
</script>
