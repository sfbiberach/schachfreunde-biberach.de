<script setup lang="ts">
const basePath = '/blog'

const route = useRoute()
const appConfig = useAppConfig()

const params = ref<string[]>([])
const category = ref<{ label: string, color: string } | undefined>()
const page = ref<number>(1)
const isArticle = ref<boolean>(false)

watchEffect(() => {
  const newParams = route.path.split(basePath)[1].split('/').filter(Boolean).map(param => param.toLocaleLowerCase())
  params.value = newParams

  const categories = Object.values(appConfig.app.blog.categories)
  category.value = categories.find(category => newParams.includes(category.label.toLocaleLowerCase()))
  const pageParam = newParams.find(param => !Number.isNaN(Number(param)))
  page.value = Number.parseInt(pageParam || '1')

  isArticle.value = newParams.length === 1 && category.value === undefined && pageParam === undefined
})
</script>

<template>
  <div v-if="isArticle">
    <BlogArticle :path="route.path" />
  </div>
  <div v-else>
    <BlogList :category="category" :page="page" />
  </div>
</template>
