// G:\Code\A_project\QingGe\vue\src\stores\app.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
    const sidebarCollapsed = ref(false)
    const visitedViews = ref([])
    const cachedViews = ref([])

    function toggleSidebar() {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    function addVisitedView(view) {
        if (visitedViews.value.some(v => v.path === view.path)) return
        visitedViews.value.push({
            name: view.name,
            path: view.path,
            title: view.meta.title || 'no-title'
        })
    }

    function addCachedView(view) {
        if (cachedViews.value.includes(view.name)) return
        if (view.meta.keepAlive) {
            cachedViews.value.push(view.name)
        }
    }

    function delVisitedView(path) {
        for (const [i, v] of visitedViews.value.entries()) {
            if (v.path === path) {
                visitedViews.value.splice(i, 1)
                break
            }
        }
    }

    function delCachedView(view) {
        const index = cachedViews.value.indexOf(view.name)
        if (index > -1) {
            cachedViews.value.splice(index, 1)
        }
    }

    return {
        sidebarCollapsed,
        visitedViews,
        cachedViews,
        toggleSidebar,
        addVisitedView,
        addCachedView,
        delVisitedView,
        delCachedView
    }
})
