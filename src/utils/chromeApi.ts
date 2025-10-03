import type { ContextItem } from '@/components/ContenxtMenu.vue'
import { computed, ref } from 'vue'
import { favorite, useDialog } from '.'
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
const deleteBookmark = (bookmark: BookmarkNode) => {
    const api = bookmark.children ? 'removeTree' : 'remove'
    if (confirm('确定删除吗?')) {
        chrome.bookmarks[api](bookmark.id)
        initBookmarks()
    }
}

export const generateContextMenuItems = (bookmark: BookmarkNode, isFavorite?: boolean): ContextItem[] => {
    if (isBookmarkFolder(bookmark)) {
        return [
            {
                title: '打开所有书签',
                icon: 'open_in_browser',
                onClick() {
                    bookmark.children?.forEach(item => {
                        window.open(item.url!, '_blank')
                    })
                }
            },
            {
                title: '添加书签',
                icon: 'bookmark_add',
                onClick() {
                    useDialog({
                        title: '新建书签',
                        type: 'bookmark',
                        data: bookmark
                    })
                }
            },
            {
                title: '删除',
                icon: 'delete',
                onClick: () => deleteBookmark(bookmark)
            }
        ]
    }
    return [
        {
            title: '在新标签页中打开',
            icon: 'open_in_browser',
            onClick() {
                chrome.tabs.create({ url: bookmark.url })
            }
        },
        {
            title: '在新窗口中打开',
            icon: 'open_in_new',
            onClick() {
                chrome.windows.create({
                    url: bookmark.url!,
                    type: 'normal'
                })
            }
        },
        {
            title: '在无痕窗口中打开',
            icon: 'visibility_off',
            onClick() {
                chrome.windows.create({
                    url: bookmark.url!,
                    incognito: true
                })
            }
        },
        { divider: true },
        {
            title: '编辑',
            icon: 'edit',
            onClick() {
                useDialog({
                    title: '编辑书签',
                    type: 'bookmark',
                    data: bookmark
                })
            }
        },
        {
            title: '删除',
            icon: 'delete',
            onClick: () => deleteBookmark(bookmark)
        },
        { divider: true },
        {
            title: isFavorite ? '移除收藏' : '加入收藏',
            icon: 'star',
            onClick() {
                if (isFavorite) {
                    favorite.delete(bookmark.id)
                }
                else {
                    favorite.add(bookmark.id)
                }
                initBookmarks()
            }
        },
        {
            title: '复制链接',
            icon: 'content_copy',
            onClick() {
            }
        },
        {
            title: '创建二维码',
            icon: 'qr_code',
            onClick() {
            }
        }
    ]
}

export const getHistory = (query: chrome.history.HistoryQuery) => {
    return sendMessage({ action: 'getHistory', query }, 'histories', [])
}

export const getTab = () => {
    return sendMessage({ action: 'getTab' }, 'tabs', [])
}
