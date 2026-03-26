import type { BookmarkNode, MessageRequest, MessageResponse } from './serviceWorker'
import { computed, ref } from 'vue'
import { useStorage } from '@/composables'

/**
 * 发送消息，无返回值处理
 * @param message 消息
 */
function sendMessage(message: MessageRequest): Promise<undefined>
/**
 * 发送消息并获取响应数据
 * @param message 消息
 * @param dataKey 响应数据的key
 * @param defaultData 无响应时的默认值
 */
function sendMessage<T extends keyof Omit<MessageResponse, 'code' | 'message'>>(
    message: MessageRequest,
    dataKey: T,
    defaultData: NonNullable<MessageResponse[T]>
): Promise<NonNullable<MessageResponse[T]>>

function sendMessage<T extends keyof Omit<MessageResponse, 'code' | 'message'>>(
    message: MessageRequest,
    dataKey?: T,
    defaultData?: NonNullable<MessageResponse[T]>
): Promise<undefined | NonNullable<MessageResponse[T]>> {
    const { promise, resolve } = Promise.withResolvers()
    chrome.runtime.sendMessage(message, (res: MessageResponse) => {
        if (!dataKey) {
            resolve(undefined)
            return
        }
        resolve(res[dataKey] ?? defaultData)
    })
    return promise as Promise<undefined | NonNullable<MessageResponse[T]>>
}

export const isBookmarkFolder = (item: BookmarkNode): item is BookmarkNode & { children: BookmarkNode[] } => Array.isArray(item.children)

const allBookmarks = ref<BookmarkNode[]>([])
export const favorateBookmarks = useStorage<BookmarkNode[]>('bookmark/favorates', [])
function filterFavorate(nodes: BookmarkNode[], favIds: Set<string>): BookmarkNode[] {
    return nodes
        .filter(node => !favIds.has(node.id))
        .map((node) => {
            if (isBookmarkFolder(node)) {
                return {
                    ...node,
                    children: filterFavorate(node.children, favIds)
                }
            }
            return node
        })
}
// 3. 核心：自动过滤后的书签树
export const normalBookmarks = computed(() => {
    const favIds = new Set(favorateBookmarks.value.map(f => f.id))
    return filterFavorate(allBookmarks.value, favIds)
})

// 4. 初始化函数（仅负责拉取数据）
export function getBookmarks() {
    chrome.runtime.sendMessage({ action: 'getBookmark' }, (res: MessageResponse) => {
        allBookmarks.value = res.bookmarks ?? []
    })
}
getBookmarks()

export function deleteFavorate(node: BookmarkNode) {
    favorateBookmarks.value = favorateBookmarks.value.filter(item => item.id !== node.id)
}

/** 不包含文件夹并且没有层级的书签 */
export const flattedBookmarks = computed(() => {
    const result: BookmarkNode[] = []
    const _flat = (items: BookmarkNode[]) => {
        for (const item of items) {
            const { children, ...rest } = item
            if (rest.url) {
                result.push(rest)
            }
            if (Array.isArray(children)) {
                _flat(children)
            }
        }
    }
    _flat(allBookmarks.value)
    return result as Array<BookmarkNode & { url: string }>
})
export function updateTab(tabId: number, option: chrome.tabs.UpdateProperties) {
    return sendMessage({ action: 'updateTab', tab: { tabId, option } })
}
export function createTab(option: chrome.tabs.CreateProperties) {
    return sendMessage({ action: 'createTab', option })
}
export function deleteBookmark(bookmark: BookmarkNode) {
    const api = bookmark.children ? 'removeTree' : 'remove'
    if (confirm('确定删除吗?')) {
        chrome.bookmarks[api](bookmark.id)
        deleteFavorate(bookmark)
        getBookmarks()
    }
}

export function getHistory(query: chrome.history.HistoryQuery) {
    return sendMessage({ action: 'getHistory', query }, 'histories', [])
}

export function getTab() {
    return sendMessage({ action: 'getTab' }, 'tabs', [])
}

/** 获取链接图标 */
export function getFavicon(u?: string) {
    if (!u) {
        return ''
    }
    const url = new URL(chrome.runtime.getURL('/_favicon/'))
    url.searchParams.set('pageUrl', u)
    url.searchParams.set('size', '64')
    return url.toString()
}
