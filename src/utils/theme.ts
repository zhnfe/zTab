export const initTheme = () => {
    const colorScheme = matchMedia('(prefers-color-scheme: dark)')
    if (colorScheme.matches) {
        document.documentElement?.classList.add('dark')
    }
    colorScheme.addEventListener('change', (e: MediaQueryListEvent) => {
        if (e.matches) {
            document.documentElement?.classList.add('dark')
            return
        }
        document.documentElement?.classList.remove('dark')
    })
}
initTheme()
