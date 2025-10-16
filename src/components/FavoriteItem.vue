<template>
    <div
        v-for="item in favorites"
        :key="item.id"
        draggable="true"
        class="xy-center bg-gray-400/10 hover:bg-gray-400/20 rounded-xl cursor-pointer"
        @click="handleClick(item)"
        @contextmenu="(e) => handleSideBarMenu(e, item)"
    >
        <div class="w-5 h-5 rounded-md overflow-hidden">
            <img :src="getFavicon(item.url)">
        </div>
    </div>
</template>
<script setup lang="ts">
import { flattedBookmarks } from '@/utils/chromeApi'
import { computed } from 'vue'
import { favorite, getFavicon } from '@/utils'
import type { BookmarkNode } from '@/utils/serviceWorker'
import { generateContextMenuItems, useContextMenu } from '@/utils/commandComponents'

const favorites = computed(() => {
    const favoriteIds: string[] = favorite.get()
    return favoriteIds.reduce<BookmarkNode[]>((acc, id) => {
        const node = flattedBookmarks.value.find(b => b.id === id)
        if (node) {
            acc.push(node)
        }
        return acc
    }, [])
})
const handleClick = (item: chrome.bookmarks.BookmarkTreeNode) => {
    chrome.tabs.create({ url: item.url })
}

const handleSideBarMenu = (e: PointerEvent, item: chrome.bookmarks.BookmarkTreeNode) => {
    e.preventDefault()
    e.stopPropagation()
    const { pageX, pageY } = e
    useContextMenu({ x: pageX, y: pageY }, generateContextMenuItems(item, true))
}
</script>
