import type { BookmarkNode } from './serviceWorker'

interface DragState {
    source: {
        el?: HTMLElement
        indexes: number[]
        data?: BookmarkNode
    }
    target: DragState['source'] & {
        position?: 'top' | 'bottom' | 'middle'
    }
    isDragging: boolean
    transition: string
}
export const dragState: DragState = {
    source: {
        indexes: []
    },
    target: {
        indexes: []
    },
    isDragging: false,
    transition: 'all 0.2s ease-out'
}
