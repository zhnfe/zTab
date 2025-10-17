<template>
    <div
        class="leading-none pb-1 px-2 cursor-pointer nav-item-shadow"
        :style="{transition: dragState.transition}"
        @click.stop="handleClick(bookmark)"
        @contextmenu="(e) => handleSideBarMenu(e, bookmark)"
    >
        <div
            class="flex items-center py-2.5 px-2.5 gap-x-2.5 rounded-xl hover:bg-primary hover:text-primary-fg hover:opacity-80"
            draggable="true"
            @dragstart="onDragStart"
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @dragover.prevent="onDragOver"
            @dragend="onDragEnd"
            @drop="onDrop"
        >
            <span>{{ indexes.at(-1) }}</span>
            <div class="w-3.5 aspect-square flex-none rounded-xs">
                <IconFolder v-if="isFolderItem" />
                <img
                    v-else
                    draggable="false"
                    :src="getFavicon(bookmark.url)"
                    @error="handleIconLoadedError"
                >
            </div>
            <div class="line-clamp-1">{{ bookmark.title }}</div>
        </div>
        <Transition
            enter-active-class="transition-all duration-200 ease-out"
            :enter-from-class="beginClass"
            :enter-to-class="endClass"
            leave-active-class="transition-all duration-200 ease-out"
            :leave-from-class="endClass"
            :leave-to-class="beginClass"
        >
            <div
                v-if="childrenVisible"
                class="grid overflow-hidden ml-3"
            >
                <div class="min-h-0">
                    <SideItem
                        v-for="child, i in bookmark.children"
                        :key="child.id"
                        :bookmark="child"
                        :indexes="[...indexes, i]"
                    />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { getFavicon } from '@/utils'
import { isBookmarkFolder } from '@/utils/chromeApi'
import { generateContextMenuItems, useContextMenu } from '@/utils/commandComponents'
import { dragState } from '@/utils/drag'
import type { BookmarkNode } from '@/utils/serviceWorker'
import { computed, inject, ref } from 'vue'
const beginClass = 'grid-rows-[0fr]'
const endClass = 'grid-rows-[1fr]'
interface Props {
    bookmark: BookmarkNode
    indexes: number[]
}
const props = withDefaults(defineProps<Props>(), {})
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

// drag
const itemHeight = 34
const clearGroupStyle = (el: HTMLElement) => {
    Object.assign(el.style, { backgroundColor: '' })
}

const handleDevider = inject<(type: 'move' | 'hide', y?: number) => void>('handleDevider')!
const onDragStart = (e: DragEvent) => {
    const target = e.currentTarget as HTMLDivElement
    Object.assign(dragState.source, {
        el: target,
        indexes: props.indexes,
        data: props.bookmark
    })
    // 创建自定义的拖拽图像
    const cloned = target.cloneNode(true) as HTMLDivElement
    cloned.classList.add('bg-primary/50', 'text-primary-fg/80')
    Object.assign(cloned.style, {
        position: 'relative',
        top: '-10000px'
    })
    document.body.appendChild(cloned)

    // 设置拖拽图像(元素, x偏移, y偏移)
    e.dataTransfer!.setDragImage(cloned, e.offsetX, e.offsetY)
    setTimeout(() => cloned.remove())
}
const onDragEnter = (e: DragEvent) => {
    const target = e.currentTarget as HTMLDivElement
    if (!target) {
        return
    }
    Object.assign(dragState.target, {
        el: target,
        indexes: props.indexes,
        data: props.bookmark
    })
}

const onDragLeave = (e: DragEvent) => {
    const target = e.currentTarget as HTMLDivElement
    if (!target) {
        return
    }
    clearGroupStyle(target)
}
const onDragOver = (e: DragEvent) => {
    const target = e.currentTarget as HTMLDivElement
    if (!target || target === dragState.source.el) {
        return
    }

    Object.assign(dragState.target, {
        el: target,
        indexes: props.indexes,
        data: props.bookmark
    })

    const y = e.offsetY
    const ratio = y / itemHeight
    const topRatio = 0.3
    const bottomRatio = 0.75
    if (ratio <= topRatio) {
        clearGroupStyle(target)
        dragState.target.position = 'top'
        handleDevider('move', target.offsetTop - 3)
    }
    else if (ratio >= bottomRatio) {
        clearGroupStyle(target)
        dragState.target.position = 'bottom'
        handleDevider('move', target.offsetTop + itemHeight + 1)
    }
    else if (ratio > topRatio && ratio < bottomRatio) {
        dragState.target.position = 'middle'
        target.style.backgroundColor = 'cyan'
        handleDevider('hide')
    }
}
const onDrop = () => {
    handleDevider('hide')
    const { source, target } = dragState
    if (!target.el || !source.el) {
        return
    }
    const pos = target.position
    if (pos === 'middle') {
        clearGroupStyle(target.el)
        return
    }

    // const parent = target.el!.parentElement as HTMLDivElement
    // const children = Array.from(parent.children) as HTMLElement[]
    // const sourceIndex = children.indexOf(source.el!)
    // const targetIndex = children.indexOf(target.el!)
    // const siblings = targetIndex >= sourceIndex
    //     ? children.slice(sourceIndex, targetIndex + 1)
    //     : children.slice(targetIndex, sourceIndex + 1)
}
const onDragEnd = () => {
    handleDevider('hide')
}
</script>
