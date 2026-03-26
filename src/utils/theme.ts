import { watchEffect } from 'vue'
import { getThemeValue } from '@/store/setup'

watchEffect(() => {
    const [themeValue, isDark] = getThemeValue()
    document.documentElement.dataset.theme = themeValue
    document.documentElement.dataset.dark = isDark.toString()
})
