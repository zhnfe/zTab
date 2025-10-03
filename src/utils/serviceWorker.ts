chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
})

export type MessageRequest = {
    action: 'getBookmark' | 'getTab'
} | {
    action: 'getHistory'
    query: chrome.history.HistoryQuery
} | {
    action: 'updateTab'
    tab: { tabId: number, option: chrome.tabs.UpdateProperties }
} | {
    action: 'createTab'
    option: chrome.tabs.CreateProperties
}

export interface MessageResponse {
    code: number
    message: string
    bookmarks?: chrome.bookmarks.BookmarkTreeNode[]
    histories?: chrome.history.HistoryItem[]
    tabs?: chrome.tabs.Tab[]
}
export type BookmarkNode = chrome.bookmarks.BookmarkTreeNode
chrome.runtime.onMessage.addListener((
    request: MessageRequest,
    sender,
    sendResponse: (response: MessageResponse) => void
) => {
    const action = request.action
    // console.log('[service worker received message] ', action)
    if (action === 'getBookmark') {
        chrome.bookmarks.getTree().then(value => {
            const bookmarks = value[0]?.children ?? []
            const data = [...bookmarks?.[0]?.children ?? [], ...bookmarks.slice(1)]
            sendResponse({
                bookmarks: data,
                code: 0,
                message: 'success'
            })
        })
        return true
    }
    if (action === 'updateTab') {
        const { tabId, option } = request.tab
        chrome.tabs.update(tabId, option).then(() => {
            sendResponse({
                code: 0,
                message: 'success'
            })
        })
        return true
    }
    if (action === 'createTab') {
        chrome.tabs.create(request.option).then(() => {
            sendResponse({
                code: 0,
                message: 'success'
            })
        })
        return true
    }
    if (action === 'getHistory') {
        chrome.history.search(request.query).then(value => {
            sendResponse({
                code: 0,
                message: 'success',
                histories: value
            })
        })
        return true
    }
    if (action === 'getTab') {
        chrome.tabs.query({}).then(value => {
            sendResponse({
                code: 0,
                message: 'success',
                tabs: value
            })
        })
        return true
    }
    sendResponse({
        code: 4,
        message: 'unknown action: ' + action
    })
})

// 弹出页
chrome.commands.onCommand.addListener(command => {
    if (command === 'openPopup') {
        chrome.tabs.create({ url: 'src/popup/index.html' })
    }
})
