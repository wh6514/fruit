// G:\Code\A_project\QingGe\vue\src\stores\user.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || '')
    const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
    const menus = ref([])

    function setToken(newToken) {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    function setUserInfo(info) {
        userInfo.value = info
        localStorage.setItem('userInfo', JSON.stringify(info))
    }

    function setMenus(menuList) {
        menus.value = menuList
    }

    function logout() {
        token.value = ''
        userInfo.value = {}
        menus.value = []
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
    }

    return {
        token,
        userInfo,
        menus,
        setToken,
        setUserInfo,
        setMenus,
        logout
    }
})
