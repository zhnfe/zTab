import { deleteBookmark, initBookmarks, isBookmarkFolder } from './chromeApi.ts'
import { render, type VNode } from 'vue'
import TheDialog from '@/components/TheDialog.vue'
import ContenxtMenu from '@/components/ContenxtMenu.vue'
import { favorite } from '.'
import type { DialogProps } from '@/components/TheDialog.vue'
import type { BookmarkNode } from './serviceWorker'

export const useDialog = (props: DialogProps) => {
    const div = document.createElement('div')
    const vm = <TheDialog {...props} onClose={() => div.remove()} />
    render(vm, div)
    document.body.appendChild(div)
}
export type ContextItem = {
    title: string
    icon: VNode
    onClick: () => void
} | {
    divider: boolean
}

// #region generateContextMenuItems
declare const IconOpenInBrowser: Icon
declare const IconBookmarkAdd: Icon
declare const IconDelete: Icon
declare const IconOpenInNew: Icon
declare const IconIncognito: Icon
declare const IconEdit: Icon
declare const IconStar: Icon
declare const IconContentCopy: Icon
declare const IconQrCode: Icon
export const generateContextMenuItems = (bookmark: BookmarkNode, isFavorite?: boolean): ContextItem[] => {
    if (isBookmarkFolder(bookmark)) {
        return [
            {
                title: '打开所有书签',
                icon: <IconOpenInBrowser />,
                onClick() {
                    bookmark.children?.forEach(item => {
                        window.open(item.url!, '_blank')
                    })
                }
            },
            {
                title: '添加书签',
                icon: <IconBookmarkAdd />,
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
                icon: <IconDelete />,
                onClick: () => deleteBookmark(bookmark)
            }
        ]
    }
    return [
        {
            title: '在新标签页中打开',
            icon: <IconOpenInBrowser />,
            onClick() {
                chrome.tabs.create({ url: bookmark.url })
            }
        },
        {
            title: '在新窗口中打开',
            icon: <IconOpenInNew />,
            onClick() {
                chrome.windows.create({
                    url: bookmark.url!,
                    type: 'normal'
                })
            }
        },
        {
            title: '在无痕窗口中打开',
            icon: <IconIncognito />,
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
            icon: <IconEdit />,
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
            icon: <IconDelete />,
            onClick: () => deleteBookmark(bookmark)
        },
        { divider: true },
        {
            title: isFavorite ? '移除收藏' : '加入收藏',
            icon: <IconStar />,
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
            icon: <IconContentCopy />,
            onClick() {
            }
        },
        {
            title: '创建二维码',
            icon: <IconQrCode />,
            onClick() {
            }
        }
    ]
}

// #endregion

export const useContextMenu = (position: { x: number, y: number }, items: ContextItem[]) => {
    const div = document.createElement('div')
    const vm = <ContenxtMenu items={items} position={position} onClose={() => div.remove()} />
    render(vm, div)
    document.body.appendChild(div)
}
