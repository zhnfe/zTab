<template>
    <div
        class="cursor-pointer hover:menu-active"
        :class="{
            'menu-dropdown-toggle': isFolderItem,
            'menu-dropdown-show': childrenVisible,
        }"
        :style="{ transition: dragState.transition }"
        @click.stop="handleClick(bookmark)"
        @contextmenu="handleSideBarMenu($event, bookmark)"
    >
        <div
            class="grid items-center py-1 grid-cols-[15px_14px_1fr] gap-2.5"
            :title="bookmark.url"
        >
            <span class="text-center">{{ indexes.at(-1) }}</span>
            <div class="rounded-xs">
                <IconFolder v-if="isFolderItem" />
                <img
                    v-else
                    draggable="false"
                    :src="getFavicon(bookmark.url)"
                    @error="handleIconLoadedError"
                />
            </div>
            <div class="line-clamp-1">{{ bookmark.title }}</div>
        </div>
    </div>
    <ul
        v-if="isFolderItem"
        class="menu-dropdown"
        :class="{
            'menu-dropdown-show': childrenVisible,
        }"
    >
        <li
            v-for="child, i in bookmark.children"
            :key="child.id"
        >
            <SideItem
                :bookmark="child"
                :indexes="[...indexes, i]"
            />
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { BookmarkNode } from '@/utils/serviceWorker'
import { computed, ref } from 'vue'
import { dragState, generateContextMenuItems, getFavicon, isBookmarkFolder, useContextMenu } from '@/utils'

const props = withDefaults(defineProps<Props>(), {})
interface Props {
    bookmark: BookmarkNode
    indexes: number[]
}
const isFolderItem = isBookmarkFolder(props.bookmark)
const showChildren = ref(false)
const childrenVisible = computed(() => {
    return !!props.bookmark.children?.length && showChildren.value
})

const handleIconLoadedError = (e: Event) => {
    // bg-[#b08c4b]
    const target = e.target as HTMLImageElement
    target.parentElement!.style.backgroundColor = '#b08c4b'
    target.remove()
}
const handleClick = (item: chrome.bookmarks.BookmarkTreeNode) => {
    if (isFolderItem) {
        return showChildren.value = !showChildren.value
    }
    chrome.tabs.create({ url: item.url })
}
const handleSideBarMenu = (e: PointerEvent, item: chrome.bookmarks.BookmarkTreeNode) => {
    e.preventDefault()
    e.stopPropagation()
    useContextMenu({ x: e.pageX, y: e.pageY }, generateContextMenuItems(item))
}
</script>
