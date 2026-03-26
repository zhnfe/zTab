<template>
    <Teleport to="body">
        <Transition
            name="modal"
            @after-leave="$emit('close')"
        >
            <div
                v-if="visible"
                ref="wrapper"
                class="fixed inset-0 w-full h-full xy-center bg-black/40 z-999"
                @click="handleClick"
            >
                <slot />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onUnmounted, useTemplateRef } from 'vue'

defineEmits(['close'])
const visible = defineModel<boolean>({ default: false })

const warpper = useTemplateRef('wrapper')

const controller = new AbortController()
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        visible.value = false
    }
}, { signal: controller.signal })
onUnmounted(() => {
    controller.abort()
})
const handleClick = (e: PointerEvent) => {
    if (e.target !== warpper.value) {
        return
    }
    visible.value = false
}
</script>
