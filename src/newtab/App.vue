<template>
    <div
        class=""
        :style="{
            // width: setting.sidebar.width + 'px',
            backgroundColor: setting.sidebar.bgColor
        }"
    >
        <!-- <side-bar /> -->
    </div>
    <div class="flex justify-center mt-[25vh]">
        <MainSearch />
    </div>
</template>

<script setup lang="ts">
import { setting } from '@/store'
import MainSearch from '@/components/MainSearch.vue'
// import SideBar from '@/components/SideBar.vue'
</script>
