import { reactive, watch, type Reactive } from 'vue'

export const useStorageData = <T extends object>(data: T, key: string): Reactive<T> => {
    const target = reactive(data)
    try {
        const res = localStorage.getItem(key)
        if (res) {
            Object.assign(target, JSON.parse(res))
        }
    }
    catch (error) {
        console.error(error)
    }
    let timer = 0
    watch(
        target,
        () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                localStorage.setItem(key, JSON.stringify(target))
            }, 500)
        },
        { deep: true }
    )
    return target
}

export const setting = useStorageData({
    sidebar: {
        bgColor: '#e8ce6f',
        width: 200
    }
}, 'setting')
