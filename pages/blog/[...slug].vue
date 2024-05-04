<script lang="ts" setup>
import dayjs from 'dayjs';
</script>

<template>
  <ContentDoc>
    <template v-slot="{ doc }">
      <article>
        <h1 class="mb-2">{{ doc.title }}</h1>
        <span class="text-sm text-foreground-2">{{ dayjs(doc.date).format('MMM D,YYYY') }}</span>
        <ContentRenderer :value="doc" />
      </article>
    </template>
    <template #not-found>
      <h1>Document not found</h1>
    </template>
  </ContentDoc>
</template>
