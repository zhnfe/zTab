<template>
    <div
        v-for="item in favorites"
        :key="item.id"
        class="xy-center bg-blue-400/30 rounded-xl cursor-pointer"
        @click="handleClick(item)"
        @contextmenu="(e) => handleSideBarMenu(e, item)"
    >
        <div class="w-6 h-6 rounded-md overflow-hidden">
            <img :src="getFavicon(item.url)">
        </div>
    </div>
</template>
<script setup lang="ts">
import { flattedBookmarks, generateContextMenuItems } from '@/utils/chromeApi'
import { computed } from 'vue'
import { favorite, getFavicon, useContextMenu } from '@/utils'
const favorites = computed(() => {
    const favoriteIds: string[] = favorite.get()
    const res = flattedBookmarks.value.filter(b => favoriteIds.includes(b.id))
    return res
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
