<template>
    <div class="card bg-base-100 w-xl shadow-sm">
        <div class="card-body">
            <div
                v-for="item in themePrefers.options"
                :key="item.key"
                class="y-center justify-between"
            >
                <template v-if="item.key === themePrefers.os">
                    <div>主题偏好</div>
                    <select
                        v-model="theme.prefers"
                        class="select max-w-48"
                        name="prefers"
                    >
                        <option
                            v-for="option in themePrefers.options"
                            :key="option.key"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </template>
                <template v-else>
                    <div>{{ item.label }}</div>
                    <select
                        v-model="theme[item.value]"
                        class="select max-w-48"
                    >
                        <option
                            v-for="themeName in themes"
                            :key="themeName"
                            :data-theme="themeName"
                            class="no-padding rounded-none py-2 bg-base-100 hover:bg-base-200 shadow before:h-3 before:w-5 before:shadow before:rounded-field before:bg-primary"
                        >
                            {{ themeName }}
                        </option>
                    </select>
                </template>
            </div>
            <div class="y-center justify-between">
                <div>背景图片</div>
                <label class="input">
                    <IconLink2 class="opacity-50" />
                    <input
                        v-model="newtabBgImage"
                        type="url"
                        placeholder="https://"
                    />
                </label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { themes } from '@/store/constant'
import { newtabBgImage, theme, themePrefers } from '@/store/setup'
</script>
