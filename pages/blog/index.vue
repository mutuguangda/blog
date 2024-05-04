<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import dayjs from 'dayjs';

const query: QueryBuilderParams = {
  path: '/blog', where: [{
    date: {
      $type: 'string'
    }
  }], sort: [{ date: -1 }]
}
const years = ref<Record<string, true>>({})

function formatToDate(s: string) {
  return dayjs(s).format('MMM D')
}

function getYear(s: string) {
  return dayjs(s).get('year')
}

function isH2(post: Record<string, any>) {
  const year = getYear(post.date)
  if (!years.value[year] && !years.value[post._path]) {
    years.value[year] = true
    years.value[post._path] = true
  }
  return years.value[post._path]
}
</script>

<template>
  <h1>Blog</h1>
  <ContentList :query="query" v-slot="{ list }">
    <div v-for="post in list" :key="post._path">
      <h2 v-if="isH2(post)">{{ getYear(post.date) }}</h2>
      <RouterLink :to="post._path">{{ post.title }} · {{ formatToDate(post.date) }}</RouterLink>
    </div>
  </ContentList>
</template>
