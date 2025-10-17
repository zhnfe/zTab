<template>
    <transition name="modal">
        <div
            ref="modal"
            v-if="visible"
            class="fixed inset-0 z-9999 origin-top flex justify-center"
            :class="themeClass"
            :style="style"
            @click="close"
        >
            <MainSearch />
        </div>
    </transition>
</template>
<script setup lang="ts">
import MainSearch from '@/components/MainSearch.vue'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
const visible = ref(false)
const modal = useTemplateRef('modal')
const close = (e: MouseEvent) => {
    if (e.target !== modal.value) {
        return
    }
    visible.value = false
}
document.addEventListener('keydown', e => {
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
const themeClass = ref('')
onMounted(() => {
    const scale = 16 / parseFloat(getComputedStyle(document.documentElement).fontSize)
    style.scale = scale.toString()
    style.paddingTop = `${25 / scale}vh`

    // toggle dark or light
    const drakScheme = matchMedia('(prefers-color-scheme: dark)')
    if (drakScheme.matches) {
        themeClass.value = 'dark'
    }
    drakScheme.addEventListener('change', (e: MediaQueryListEvent) => {
        if (e.matches) {
            themeClass.value = 'dark'
            return
        }
    })
    const lightScheme = matchMedia('(prefers-color-scheme: light)')
    lightScheme.addEventListener('change', (e: MediaQueryListEvent) => {
        if (e.matches) {
            themeClass.value = ''
            return
        }
    })
})

</script>
