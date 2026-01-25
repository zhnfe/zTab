import { reactive, watch, type Reactive } from 'vue'

export const useStorageData = <T extends object>(data: T, key: string): Reactive<T> => {
    const target = reactive(data)
    try {
        const res = localStorage.getItem(key)
        if (res) {
            Object.assign(target, JSON.parse(res))
        }
        else {
            localStorage.setItem(key, JSON.stringify(target))
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
        bgColor: '#000',
        width: 300
    },
    bgImage: 'https://w.wallhaven.cc/full/zp/wallhaven-zpzjoy.jpg'
}, 'setting')
