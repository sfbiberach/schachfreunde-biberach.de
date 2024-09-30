<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const category = ref<{ label: string, color: string } | undefined>()
const page = ref<number>(1)

watchEffect(() => {
  const slugArray = Array.isArray(route.params.slug) ? route.params.slug : [route.params.slug]
  const filteredSlugArray = slugArray.filter((param): param is string => param !== undefined && param !== '')
  const params = filteredSlugArray.map(param => param.toLocaleLowerCase())

  const categories = Object.values(appConfig.app.blog.categories)
  category.value = categories.find(category => params.includes(category.label.toLocaleLowerCase()))

  const pageParam = params.find(param => !Number.isNaN(Number(param)))
  page.value = Number.parseInt(pageParam ?? page.value.toString())
})
</script>

<template>
  <div>
    <BlogList :category="category" :page="page" />
  </div>
</template>
