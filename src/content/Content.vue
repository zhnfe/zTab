<template>
    <transition name="modal">
        <div
            v-if="visible"
            ref="modal"
            class="fixed inset-0 z-9999 origin-top flex justify-center"
            :style="style"
            @click="close"
        >
            <MainSearch
                :data-theme="theme[0]"
                class="main-content"
            />
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, useTemplateRef } from 'vue'
import MainSearch from '@/components/MainSearch.vue'
import { getThemeValue } from '@/store/setup'

const visible = ref(false)
const modal = useTemplateRef('modal')
const close = (e: MouseEvent) => {
    if (e.target !== modal.value) {
        return
    }
    visible.value = false
}
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        visible.value = !visible.value
    }
    if (e.key === 'Escape' && visible.value) {
        visible.value = false
    }
}, true)
const style = reactive({
    scale: '',
    paddingTop: ''
})

const theme = computed(getThemeValue)
onMounted(() => {
    const scale = 16 / Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    style.scale = scale.toString()
    style.paddingTop = `${25 / scale}vh`
})
</script>
