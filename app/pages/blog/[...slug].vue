<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const category = ref<{ label: string, color: string } | undefined>()
const page = ref<number>(1)
const isArticle = ref<boolean>(false)

watchEffect(() => {
  const slugArray = Array.isArray(route.params.slug) ? route.params.slug : [route.params.slug]
  const filteredSlugArray = slugArray.filter((param): param is string => param !== undefined && param !== '')
  const params = filteredSlugArray.map(param => param.toLocaleLowerCase())

  const categories = Object.values(appConfig.app.blog.categories)
  category.value = categories.find(category => params.includes(category.label.toLocaleLowerCase()))

  const pageParam = params.find(param => !Number.isNaN(Number(param)))
  page.value = Number.parseInt(pageParam || '1')

  isArticle.value = params.length === 1 && category.value === undefined && pageParam === undefined
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
