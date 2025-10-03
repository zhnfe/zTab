export const initTheme = () => {
    const drakScheme = matchMedia('(prefers-color-scheme: dark)')
    if (drakScheme.matches) {
        document.documentElement?.classList.add('dark')
    }
    drakScheme.addEventListener('change', (e: MediaQueryListEvent) => {
        if (e.matches) {
            document.documentElement?.classList.add('dark')
            return
        }
    })
    const lightScheme = matchMedia('(prefers-color-scheme: light)')
    lightScheme.addEventListener('change', (e: MediaQueryListEvent) => {
        if (e.matches) {
            document.documentElement?.classList.remove('dark')
            return
        }
    })
}
initTheme()
