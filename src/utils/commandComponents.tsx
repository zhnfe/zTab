import type { BookmarkNode } from './serviceWorker'
import type { BookmarkFormProps } from '@/components/BookmarkForm.vue'
import { render } from 'vue'
import BookmarkForm from '@/components/BookmarkForm.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import { deleteBookmark, deleteFavorate, favorateBookmarks, getBookmarks, isBookmarkFolder } from '.'

export function modifyBookmark(props: BookmarkFormProps) {
    const div = document.createElement('div')

    const close = () => {
        render(null, div)
        div.remove()
    }

    const vm = <BookmarkForm {...props} onClose={close} />
    render(vm, div)
    document.body.appendChild(div)
}
export type ContextItem
    = | {
        title: string
        icon: () => Promise<typeof import('~vic/*')>
        onClick: () => void
    }
    | {
        divider: boolean
    }

// #region generateContextMenuItems
export function generateContextMenuItems(bookmark: BookmarkNode, isFavorite?: boolean): ContextItem[] {
    if (isBookmarkFolder(bookmark)) {
        return [
            {
                title: '打开所有书签',
                icon: () => import('~vic/IconOpenInBrowser'),
                onClick() {
                    bookmark.children?.forEach((item) => {
                        window.open(item.url!, '_blank')
                    })
                }
            },
            {
                title: '添加书签',
                icon: () => import('~vic/IconBookmarkAdd'),
                onClick() {
                    modifyBookmark({
                        type: 'add',
                        data: bookmark
                    })
                }
            },
            {
                title: '删除',
                icon: () => import('~vic/IconDelete'),
                onClick: () => deleteBookmark(bookmark)
            }
        ]
    }
    return [
        {
            title: '在新标签页中打开',
            icon: () => import('~vic/IconOpenInBrowser'),
            onClick() {
                chrome.tabs.create({ url: bookmark.url })
            }
        },
        {
            title: '在新窗口中打开',
            icon: () => import('~vic/IconOpenInNew'),
            onClick() {
                chrome.windows.create({
                    url: bookmark.url!,
                    type: 'normal'
                })
            }
        },
        {
            title: '在无痕窗口中打开',
            icon: () => import('~vic/IconIncognito'),
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
            icon: () => import('~vic/IconEdit'),
            onClick() {
                modifyBookmark({
                    type: 'update',
                    data: bookmark
                })
            }
        },
        {
            title: '删除',
            icon: () => import('~vic/IconDelete'),
            onClick: () => deleteBookmark(bookmark)
        },
        { divider: true },
        {
            title: isFavorite ? '移除收藏' : '加入收藏',
            icon: () => import('~vic/IconStar'),
            onClick() {
                if (isFavorite) {
                    deleteFavorate(bookmark)
                }
                else {
                    favorateBookmarks.value.push(bookmark)
                }
                getBookmarks()
            }
        },
        {
            title: '复制链接',
            icon: () => import('~vic/IconContentCopy'),
            onClick() {
            }
        },
        {
            title: '创建二维码',
            icon: () => import('~vic/IconQrCode'),
            onClick() {
            }
        },
        {
            title: '添加书签',
            icon: () => import('~vic/IconBookmarkAdd'),
            onClick() {
                modifyBookmark({
                    type: 'add',
                    data: bookmark
                })
            }
        }
    ]
}

// #endregion

export function useContextMenu(position: { x: number, y: number }, items: ContextItem[]) {
    const menuWidth = 220
    if (menuWidth + position.x > innerWidth) {
        position.x = innerWidth - menuWidth
    }
    const div = document.createElement('div')
    const close = () => {
        render(null, div)
        div.remove()
    }
    const vm = <ContextMenu items={items} position={position} onClose={close} />
    render(vm, div)
    document.body.appendChild(div)
}
