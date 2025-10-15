import ContenxtMenu, { type ContextItem } from '@/components/ContenxtMenu.vue'
import TheDialog, { type DialogProps } from '@/components/TheDialog.vue'
import { h, render } from 'vue'

export const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export const useContextMenu = (position: { x: number, y: number }, items: ContextItem[]) => {
    const div = document.createElement('div')
    render(
        h(ContenxtMenu, {
            items,
            position,
            onClose() {
                div.remove()
            }
        }),
        div
    )
    document.body.appendChild(div)
}
export const useDialog = (props: DialogProps) => {
    const div = document.createElement('div')
    const vm = h(TheDialog, {
        ...props,
        onClose: () => div.remove()
    })
    render(vm, div)
    document.body.appendChild(div)
}

/**
 * 扁平化数组对象
 * @param array - 原数组
 * @param childrenKey - 子数组的键名
 * @returns 扁平化后的数组
 */
export const flatArrayObject = <T extends Record<string, unknown>>(
    array: T[],
    childrenKey = 'children' as keyof T
): Omit<T, typeof childrenKey>[] => {
    const result: T[] = []

    const flat = (items: T[]): void => {
        for (const item of items) {
            const { [childrenKey]: children, ...rest } = item
            result.push(rest as T)
            if (Array.isArray(children)) {
                flat(children)
            }
        }
    }

    flat(array)
    return result
}

/** 获取链接图标 */
export const getFavicon = (u?: string) => {
    if (!u) {
        return ''
    }
    const url = new URL(chrome.runtime.getURL('/_favicon/'))
    url.searchParams.set('pageUrl', u)
    url.searchParams.set('size', '64')
    return url.toString()
}

export const favorite = {
    ids: [] as string[],
    get(): string[] {
        return JSON.parse(localStorage.getItem('favoriteIds') ?? '[]')
    },
    set(ids: string[]) {
        localStorage.setItem('favoriteIds', JSON.stringify([...new Set(ids)]))
    },
    add(id: string) {
        const ids = [...this.get(), id]
        this.set(ids)
    },
    delete(id: string) {
        const current = this.get()
        this.set(current.filter(item => item !== id))
    }
}
type StyleProperties = Exclude<
    keyof CSSStyleDeclaration,
    'length' | 'parentRule' | number | typeof Symbol.iterator
>
export function css(el: HTMLElement, style: StyleProperties, value: string): void
export function css(el: HTMLElement, style: Partial<Record<StyleProperties, string>>): void

// 函数实现
export function css(
    el: HTMLElement,
    style: StyleProperties | Partial<Record<StyleProperties, string>>,
    value?: string
): void {
    if (typeof style === 'string') {
        if (value) {
            el.style.setProperty(style, value)
        }
    }
    else {
        Object.assign(el.style, style)
    }
}
