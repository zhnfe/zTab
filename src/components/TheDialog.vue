<template>
    <transition
        name="modal"
        @after-leave="$emit('close')"
    >
        <div
            v-if="visible"
            ref="modal"
            class="bg-black/50 fixed inset-0 z-999 xy-center"
            @click="close"
        >
            <div
                class="
                    absolute bg-primary-bg border shadow-sm rounded-lg
                    min-w-100 p-5
                    text-sm
                "
                @click.stop
            >
                <div class="text-xl font-medium mb-4">{{ title }} - {{ visible }}</div>
                <form>
                    <label class="grid gap-x-3 mb-4 grid-cols-[50px_1fr] auto-rows-[32px] items-center">
                        <span>名称</span>
                        <input
                            type="text"
                            name="title"
                            class="border-1 border-gray-300 rounded-sm h-full px-2.5 focus-visible:outline-0 focus-visible:border-blue-400"
                            v-model="state.title"
                        >
                    </label>
                    <label class="grid gap-x-3 mb-4 grid-cols-[50px_1fr] auto-rows-[30px] items-center">
                        <span>链接</span>
                        <input
                            type="text"
                            name="title"
                            class="border-1 border-gray-300 rounded-sm h-full px-2.5 focus-visible:outline-0 focus-visible:border-blue-400"
                            v-model="state.url"
                        >
                    </label>
                </form>
                <div class="flex flex-row-reverse gap-x-3 text-white">
                    <button
                        type="submit"
                        class="px-4 py-1.5 bg-blue-400 rounded-xl cursor-pointer"
                        @click="onSubmit"
                    >
                        确认
                    </button>
                    <button
                        class="text-black px-4 py-1.5 border-1 border-gray-300 rounded-xl cursor-pointer"
                        @click="close()"
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>
<script setup lang="ts">
import { initBookmarks, isBookmarkFolder } from '@/utils/chromeApi'
import type { BookmarkNode } from '@/utils/serviceWorker'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
export interface DialogProps {
    title: string
    url?: string
    parentId?: string
    type: 'folder' | 'bookmark'
    data?: BookmarkNode
}
const props = defineProps<DialogProps>()

const state = reactive({
    title: props.data?.title ?? '',
    url: props.data?.url ?? ''
})
defineEmits(['close'])
const visible = ref(false)
const close = () => {
    visible.value = false
}
const onSubmit = async () => {
    await chrome.bookmarks.create({
        title: state.title,
        url: state.url,
        parentId: props.data && isBookmarkFolder(props.data) ? props.data.id : props.data?.parentId
    })
    alert('添加成功')
    close()
    initBookmarks()
}
document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        close()
    }
}, { once: true })
onBeforeUnmount(() => {
    console.log('unmounted')
})
onMounted(() => {
    visible.value = true
})
</script>
