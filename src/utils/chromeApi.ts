import { computed, ref } from 'vue'
import type { BookmarkNode, MessageRequest, MessageResponse } from './serviceWorker'

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

export const isBookmarkFolder = (item: BookmarkNode) => 'children' in item

export const bookmarks = ref<BookmarkNode[]>([])

export const initBookmarks = () => {
    chrome.runtime.sendMessage({ action: 'getBookmark' }, (res: MessageResponse) => {
        bookmarks.value = res.bookmarks ?? []
    })
}
initBookmarks()

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
    _flat(bookmarks.value)
    return result as Array<BookmarkNode & { url: string }>
})
export const updateTab = (tabId: number, option: chrome.tabs.UpdateProperties) => {
    return sendMessage({ action: 'updateTab', tab: { tabId, option } })
}
export const createTab = (option: chrome.tabs.CreateProperties) => {
    return sendMessage({ action: 'createTab', option })
}
export const deleteBookmark = (bookmark: BookmarkNode) => {
    const api = bookmark.children ? 'removeTree' : 'remove'
    if (confirm('确定删除吗?')) {
        chrome.bookmarks[api](bookmark.id)
        initBookmarks()
    }
}

export const getHistory = (query: chrome.history.HistoryQuery) => {
    return sendMessage({ action: 'getHistory', query }, 'histories', [])
}

export const getTab = () => {
    return sendMessage({ action: 'getTab' }, 'tabs', [])
}
