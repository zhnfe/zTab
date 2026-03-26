<template>
    <Modal v-model="visible" @close="$emit('close')">
        <form
            class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
            @submit="onSubmit"
        >
            <legend class="fieldset-legend text-sm">{{ title }}</legend>
            <label class="fieldset">
                <span class="label">书签名</span>
                <input
                    v-model="state.title"
                    name="title"
                    type="text"
                    class="input validator"
                    placeholder="书签名"
                    required
                />
            </label>

            <label class="fieldset">
                <span class="label">URL</span>
                <input
                    v-model="state.url"
                    name="url"
                    type="url"
                    class="input validator"
                    placeholder="URL"
                />
            </label>
            <button class="btn btn-neutral mt-4" type="submit">提交</button>
        </form>
    </Modal>
</template>

<script setup lang="ts">
import type { BookmarkNode } from '@/utils/serviceWorker'
import { onMounted, reactive, ref } from 'vue'
import { initBookmarks, isBookmarkFolder } from '@/utils'
import Modal from './Modal.vue'

export interface BookmarkFormProps {
    type: 'add' | 'update'
    data: BookmarkNode
}
const props = defineProps<BookmarkFormProps>()
defineEmits(['close'])

const title = props.type === 'add' ? '添加书签' : '编辑书签'
const state = reactive({
    title: props.data.title,
    url: props.data.url
})
const visible = ref(false)

const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const bookmark = props.data
    if (props.type === 'add') {
        await chrome.bookmarks.create({
            title: state.title,
            url: state.url,
            parentId: isBookmarkFolder(bookmark) ? bookmark.id : bookmark.parentId || '1'
        })
    }
    else if (props.type === 'update') {
        await chrome.bookmarks.update(bookmark.id, {
            title: state.title,
            url: state.url
        })
    }
    else {
        throw new Error('Unknown type')
    }
    alert(`${title}成功`)
    visible.value = false
    initBookmarks()
}
onMounted(() => {
    visible.value = true
})
</script>
