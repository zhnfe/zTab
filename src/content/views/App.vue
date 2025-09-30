<template>
    <transition name="modal">
        <div
            ref="modal"
            v-if="visible"
            class="fixed inset-0 z-999"
            @click="close"
        >
            <main-search class="mt-[25vh]" />
        </div>
    </transition>
</template>
<script setup lang="ts">
import MainSearch from '@/components/MainSearch.vue'
import { ref, useTemplateRef } from 'vue'
const visible = ref(false)
const modal = useTemplateRef('modal')
const close = (e: MouseEvent) => {
    if (e.target !== modal.value) {
        return
    }
    visible.value = false
}
document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        visible.value = !visible.value
    }
})

</script>
