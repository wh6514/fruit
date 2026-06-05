<!-- G:\Code\A_project\QingGe\vue\src\layout\components\SidebarItem.vue -->
<template>
  <template v-if="!item.hidden">
    <el-menu-item
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)"
      :index="resolvePath(onlyOneChild.path)"
    >
      <el-icon v-if="onlyOneChild.meta?.icon">
        <component :is="onlyOneChild.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ onlyOneChild.meta?.title }}</span>
      </template>
    </el-menu-item>

    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span v-if="item.meta?.title">{{ item.meta.title }}</span>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import path from 'path-browserify'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})

const onlyOneChild = computed(() => {
  const showingChildren = props.item.children?.filter(item => !item.hidden)
  if (showingChildren?.length === 1) {
    return showingChildren[0]
  }
  if (showingChildren?.length === 0) {
    return {
      ...props.item,
      path: '',
      noShowingChildren: true
    }
  }
  return null
})

const hasOneShowingChild = (children, parent) => {
  const showingChildren = children?.filter(item => !item.hidden)
  if (showingChildren?.length === 1) {
    return true
  }
  if (showingChildren?.length === 0) {
    return true
  }
  return false
}

const resolvePath = (routePath) => {
  return path.resolve(props.basePath, routePath)
}
</script>
