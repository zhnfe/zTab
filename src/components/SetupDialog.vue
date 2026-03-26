<template>
    <Modal v-model="visible">
        <Setup />
    </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import Setup from './Setup.vue'

const visible = defineModel<boolean>()
</script>
