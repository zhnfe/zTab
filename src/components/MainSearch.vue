<template>
    <div class="card bg-base-100 p-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-40 w-180 no-offset-shadow-150">
        <div class="y-center h-11 px-3 gap-3">
            <IconSearch />
            <input
                ref="searchInput"
                class="flex-1 leading-11 focus-visible:outline-0"
                autocomplete="off"
                tabindex="0"
                name="zTab-MainSearch"
                :value="state.query"
                @input="onInput"
                @compositionend="onCompositionEnd"
                @keydown="handleKeyDown"
            />
        </div>
        <hr v-if="result.length" class="border-base-content/30 my-1.5" />

        <div ref="resultContainer" class="max-h-62 overflow-y-auto">
            <div
                v-for="item, index in result"
                :key="item.url"
                class="y-center gap-3 rounded-md p-3 mb-1 text-sm cursor-pointer hover:bg-accent hover:text-accent-content"
                :style="index === state.curIndex
                    ? {
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-primary-content)',
                    }
                    : {}
                "
                :class="index === state.curIndex ? 'bg-primary text-primary-content' : ''"
                @click="onItemConfirm(item)"
            >
                <img
                    v-if="showFavicon(item)"
                    class="w-5.5 p-1 bg-accent/60 rounded-sm"
                    :src="getFavicon(item.url)"
                />
                <IconSearch v-else class="w-5.5 h-5.5 p-0.5" />
                <div class="line-clamp-1 mr-5">{{ item.title }}</div>
                <div
                    class="text-desc ml-auto text-nowrap"
                    :class="index === state.curIndex ? 'text-primary-desc' : ''"
                >
                    <span v-if="item.tabId">转到此 Tab</span>
                    <span v-else-if="item.isHistory">history</span>
                    <span v-else-if="item.isBookmark">bookmark</span>
                    <span v-else-if="item.isEngine">{{ curSearchEngine.title }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import { createTab, flattedBookmarks, getFavicon, getHistory, getTab, updateTab } from '@/utils'

const searchEngines = [
    {
        title: 'Google',
        url: 'https://www.google.com/search?q='
    },
    {
        title: 'Baidu',
        url: 'https://www.baidu.com/s?wd='
    }
] as const
const curSearchEngine = searchEngines[0]

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
    curIndex: -1
})

const result = ref<Result[]>([])
const resultContainer = useTemplateRef('resultContainer')

const searchBookmark = async (q: string) => {
    if (!q) {
        return []
    }
    return flattedBookmarks.value.reduce<Result[]>((acc, item) => {
        if (item.title.toLowerCase().includes(q) || item.url.toLowerCase().includes(q)) {
            acc.push({ title: item.title, url: item.url, isBookmark: true })
        }
        return acc
    }, []).slice(0, 10)
}
const searchHistory = async (q: string) => {
    const res = await getHistory({ text: q, maxResults: 15, startTime: 1735689600000 })
    return res.map(item => ({ title: item.title!, url: item.url!, isHistory: true }))
}
const searchTab = async (q: string) => {
    const tabs = await getTab()
    return tabs.reduce<Result[]>((acc, item) => {
        if (!item.title || !item.url || item.active) {
            return acc
        }
        if (item.title.toLowerCase().includes(q) || item.url.toLowerCase().includes(q)) {
            acc.push({ title: item.title!, url: item.url!, tabId: item.id })
        }
        return acc
    }, []).slice(0, 8)
}
const searchEngine = async (q: string) => {
    if (!q) {
        return []
    }
    const targetUrl = curSearchEngine.url + decodeURIComponent(q)
    return [{
        title: state.query,
        url: targetUrl,
        isEngine: true
    }]
}

const search = async (q: string) => {
    const res = await Promise.all<Result[]>([searchEngine(q), searchBookmark(q), searchTab(q), searchHistory(q)])
    // 根据url去重，时间复杂度on
    const map = new Map<string, Result>()
    res.flat().forEach((item) => {
        if (!map.has(item.url)) {
            map.set(item.url, item)
        }
    })
    result.value = Array.from(map.values())
}

let isComposing = false
const onInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    isComposing = e.isComposing
    state.query = target.value ?? ''
    state.curIndex = 0
    const q = state.query.toLowerCase().trim()
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

const onItemConfirm = (item?: Result) => {
    if (!item) {
        return
    }
    if (item.tabId) {
        updateTab(item.tabId, { active: true })
        return
    }
    createTab({ url: item.url })
}
const handleKeyDown = (e: KeyboardEvent) => {
    if (isComposing) {
        return
    }
    if (['ArrowUp', 'ArrowDown', 'Enter', 'Tab'].includes(e.key)) {
        e.preventDefault()
    }
    e.stopImmediatePropagation()
    if ((e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) && state.curIndex > 0) {
        state.curIndex--
    }
    if ((e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) && state.curIndex < result.value.length - 1) {
        state.curIndex++
    }
    if (e.key === 'Enter') {
        onItemConfirm(result.value[state.curIndex])
    }
}
const searchInput = useTemplateRef('searchInput')
onMounted(() => {
    searchInput.value?.focus()
    search('')
})
watch(() => state.curIndex, (i) => {
    if (!resultContainer.value) {
        return
    }
    const el = resultContainer.value.children[i]
    el?.scrollIntoView(false)
})
</script>
