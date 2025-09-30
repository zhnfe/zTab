<template>
    <div class="flex justify-center">
        <div
            class="w-180 bg-primary-bg no-spread-shadow-20 rounded-xl p-3 text-base"
            @keydown="handleKeyDown"
        >
            <div class="flex items-center h-11 px-3">
                <span
                    class="w-5.5 text-center px-1 material-icons-outlined mr-3 align-bottom"
                    style="scale: 1"
                >
                    search
                </span>
                <input
                    class="flex-1 leading-11 focus-visible:outline-0"
                    contenteditable="true"
                    autofocus="true"
                    name="search"
                    :value="state.query"
                    @input="onInput"
                    @compositionend="onCompositionEnd"
                >
            </div>
            <hr class="border-border my-1.5">
            <div class="max-h-62 overflow-y-auto" ref="resultContainer">
                <div
                    v-for="item, index in result"
                    :key="item.url"
                    class="flex items-center grid-cols rounded-md p-3 mb-1 text-sm cursor-pointer hover:bg-gray-200 hover:text-black"
                    :style="index === state.curIndex ? {backgroundColor: '#b7aa75', color: '#fff'} : {}"
                    @click="handleResultItemClick(item)"
                >
                    <img
                        v-if="showFavicon(item)"
                        class="w-5.5 p-1 mr-3 bg-white rounded-sm"
                        :src="getFavicon(item.url)"
                    >
                    <span
                        v-else
                        class="w-5.5 text-center px-1 material-icons-outlined mr-3 align-bottom"
                        style="scale: 1.14"
                    >
                        search
                    </span>
                    <div>{{ item.title }}</div>
                    <div class="text-gray-700 ml-auto">
                        <span v-if="item.tabId" class="ml-auto mr-2">转到此 Tab</span>
                        <span v-else-if="item.isHistory">history</span>
                        <span v-else-if="item.isBookmark">bookmark</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getFavicon } from '@/utils'
import { flattedBookmarks } from '@/utils/bookmarks'
import { computed, reactive, useTemplateRef, watch } from 'vue'

const searchEngines = [
    {
        title: 'Google',
        url: 'https://www.google.com/search?q='
    },
    {
        title: 'Baidu',
        url: 'https://www.baidu.com/s?wd='
    }
]
const eachResultCount = 5

interface Result {
    url: string
    title: string
    tabId?: number
    isEngine?: boolean
    isHistory?: boolean
    isBookmark?: boolean
}

const state = reactive({
    query: '',
    curIndex: -1,
    curSearchEngine: searchEngines[0]!
})

const results = reactive<Record<'bookmark' | 'history' | 'tab' | 'engine', Result[]>>({
    bookmark: [],
    history: [],
    tab: [],
    engine: []
})

const searchBookmark = (q: string) => {
    results.bookmark = flattedBookmarks.value
        .filter(item => item.title.toLowerCase().includes(q) || item.url.includes(q))
        .slice(0, eachResultCount)
        .map(item => ({
            title: item.title,
            url: item.url,
            isBookmark: true
        }))
}
const searchHistory = async (q: string) => {
    const res = await chrome.history.search({ text: q, maxResults: eachResultCount })
    results.history = res
        .filter(item => !results.tab.some(tab => tab.url === item.url))
        .map(item => ({ title: item.title!, url: item.url!, isHistory: true }))
}
const searchTab = async (q: string) => {
    const tabs = await chrome.tabs.query({})
    results.tab = tabs
        .filter(item => {
            if (!item.title || !item.url || item.active) {
                return false
            }
            return item.title.toLowerCase().includes(q.toLowerCase()) || item.url.toLowerCase().includes(q.toLowerCase())
        })
        .map(item => ({ title: item.title!, url: item.url!, tabId: item.id })).slice(0, eachResultCount)
    results.history = results.history.filter(item => !results.tab.some(tab => tab.url === item.url))
}
const resultContainer = useTemplateRef('resultContainer')
const searchEngine = (q: string) => {
    if (!q) {
        results.engine = []
        return
    }
    const targetUrl = state.curSearchEngine.url + decodeURIComponent(q)
    results.engine = [{
        title: state.query,
        url: targetUrl,
        isEngine: true
    }]
}

const search = (q: string) => {
    searchHistory(q)
    searchBookmark(q)
    searchTab(q)
    searchEngine(q)
}
search('')

const result = computed(() => {
    const { bookmark, history, tab, engine } = results
    const res = [...tab, ...history, ...bookmark]
    if (!res.length) {
        return engine
    }
    res.splice(1, 0, ...engine)
    return res
})
const curItem = computed(() => {
    return result.value[state.curIndex] ?? { url: '', title: '' }
})
let isComposing = false
const onInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    isComposing = e.isComposing
    state.query = target.value ?? ''
    state.curIndex = 0
    const q = state.query.toLowerCase()
    search(q)
}
const onCompositionEnd = () => {
    isComposing = false
}
const showFavicon = (item: Result) => {
    if (item.isEngine) {
        return false
    }
    return !!item.url
}

const onItemConfirm = () => {
    if (curItem.value.tabId) {
        chrome.tabs.update(curItem.value.tabId, { active: true })
        return
    }
    if (!state.query) {
        return
    }
    window.open(curItem.value.url, '_blank')
}
const handleKeyDown = (e: KeyboardEvent) => {
    if (isComposing) {
        return
    }
    if (e.key === 'ArrowUp' && state.curIndex > 0) {
        state.curIndex--
    }
    if (e.key === 'ArrowDown' && state.curIndex < result.value.length - 1) {
        state.curIndex++
    }
    if (e.key === 'Enter' && curItem.value.url) {
        e.preventDefault()
        onItemConfirm()
    }
}
const handleResultItemClick = (item: Result) => {
    window.open(item.url, '_blank')
}
watch(() => state.curIndex, i => {
    if (!resultContainer.value) {
        return
    }
    const el = resultContainer.value.children[i]
    el?.scrollIntoView(false)
})
</script>
