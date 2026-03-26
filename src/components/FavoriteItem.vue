<template>
    <div
        v-for="item in favorateBookmarks"
        :key="item.id"
        draggable="true"
        class="xy-center bg-base-content/10 hover:bg-base-content/20 rounded-xl cursor-pointer"
        @click="handleClick(item)"
        @contextmenu="(e) => handleSideBarMenu(e, item)"
    >
        <div class="w-5 h-5 rounded-md overflow-hidden">
            <img :src="getFavicon(item.url)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { favorateBookmarks, generateContextMenuItems, getFavicon, useContextMenu } from '@/utils'

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
