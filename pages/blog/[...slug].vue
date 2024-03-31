<script setup lang="ts">
const basePath = '/blog'

const route = useRoute()
const appConfig = useAppConfig()

const params = ref<string[]>([])
const category = ref<string | undefined>()
const page = ref<number>(1)
const isArticle = ref<boolean>(false)

watchEffect(() => {
  const newParams = route.path.split(basePath)[1].split('/').filter(Boolean)
  params.value = newParams

  const categories = Object.values(appConfig.app.blog.categories).flatMap(category => category.label?.toLowerCase())
  category.value = newParams.find(param => categories.includes(param))
  const pageParam = newParams.find(param => !Number.isNaN(Number(param)))
  page.value = Number.parseInt(pageParam || '1', 10)

  isArticle.value = newParams.length === 1 && category.value === undefined && pageParam === undefined
})
</script>

<template>
  <template v-if="isArticle">
    <BlogArticle :path="route.path" />
  </template>
  <template v-else>
    <BlogList :category="category" :page="page" />
  </template>
</template>
