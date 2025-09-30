import type { ContextItem } from '@/components/ContenxtMenu.vue'
import { computed, ref } from 'vue'
import { useDialog } from '.'

type BookmarkNode = chrome.bookmarks.BookmarkTreeNode

export const isBookmarkFolder = (item: BookmarkNode) => 'children' in item

export const bookmarks = ref<BookmarkNode[]>([])

export const initBookmarks = async () => {
    const res = (await chrome.bookmarks.getTree())?.[0]?.children ?? []
    const data = [...res?.[0]?.children ?? [], ...res.slice(1)]
    bookmarks.value = data
}
initBookmarks()

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

const deleteBookmark = (bookmark: BookmarkNode) => {
    if (confirm('确定删除吗?')) {
        chrome.bookmarks.remove(bookmark.id)
        initBookmarks()
    }
}
export const generateContextMenuItems = (bookmark: chrome.bookmarks.BookmarkTreeNode): ContextItem[] => {
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
                window.open(bookmark.url!, '_blank')
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
                console.log('edit')
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
