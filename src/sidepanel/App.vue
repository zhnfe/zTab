<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
// import { setting } from '@/store'

</script>

<template>
    <side-bar
        :style="{
            // backgroundColor: setting.sidebar.bgColor,
            position: 'fixed',
            inset: '0'
        }"
        hide-slider="true"
    />
</template>
