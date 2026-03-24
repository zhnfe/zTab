const light = 'cupcake'
// const dark = 'black'
// const dark = 'halloween'
// const dark = 'forest'
const dark = 'night'
export function initTheme() {
    const drakScheme = matchMedia('(prefers-color-scheme: dark)')
    if (drakScheme.matches) {
        document.documentElement.dataset.theme = dark
    }
    else {
        document.documentElement.dataset.theme = light
    }
    drakScheme.addEventListener('change', (e: MediaQueryListEvent) => {
        if (e.matches) {
            document.documentElement.dataset.theme = dark
        }
    })
    const lightScheme = matchMedia('(prefers-color-scheme: light)')
    lightScheme.addEventListener('change', (e: MediaQueryListEvent) => {
        if (e.matches) {
            document.documentElement.dataset.theme = light
        }
    })
}
initTheme()
