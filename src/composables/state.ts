import type { Reactive, Ref } from 'vue'
import { isRef, reactive, ref, watch } from 'vue'

function watchTarget(key: string, target: Reactive<unknown> | Ref<unknown>) {
    let timer = 0
    watch(
        target,
        () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                chrome.storage.local.set({ [key]: isRef(target) ? target.value : target })
            }, 500)
        },
        { deep: true }
    )
}
export function useStorageData<T extends object>(key: string, data: T) {
    const target = reactive(data)
    chrome.storage.local.get(key).then((value) => {
        const res = value[key]
        if (res) {
            Object.assign(target, res)
        }
    })
    watchTarget(key, target)
    return target
}

export function useStorage<T>(key: string, data: T) {
    const target = ref(data)
    chrome.storage.local.get(key).then((value) => {
        const res = value[key]
        if (res) {
            target.value = res
        }
    })
    watchTarget(key, target)
    return target as Ref<T>
}
