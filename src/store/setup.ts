import type { Themes } from './constant'
import { useMediaQuery } from '@vueuse/core'
import { useStorage, useStorageData } from '@/composables'
import { makeOptions } from '@/utils'
import { themes } from './constant'

export const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

export const themePrefers = makeOptions([
    { label: '跟随系统', value: 'os', key: 'os' },
    { label: ' 浅色主题', value: 'light', key: 'light' },
    { label: ' 深色主题', value: 'dark', key: 'dark' }
])
export type ThemePrefers = typeof themePrefers.options[number]['value']
export const theme = useStorageData('setup/theme', {
    prefers: themePrefers.os as ThemePrefers,
    light: themes.cupcake as Themes,
    dark: themes.dark as Themes
})
export function getThemeValue(): [Themes, boolean] {
    const isDark = prefersDark.value
    if (theme.prefers === themePrefers.os) {
        return isDark ? [theme.dark, isDark] : [theme.light, isDark]
    }
    return [theme[theme.prefers], theme.prefers === themePrefers.dark]
}

export const sidebarWidth = useStorage('setup/sidebarWidth', 300)
export const newtabBgImage = useStorage('setup/newtabBgImage', 'https://w.wallhaven.cc/full/ml/wallhaven-mld559.jpg')
