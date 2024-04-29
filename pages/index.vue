<template>
  <ContentList path="/blog" v-slot="{ list }">
    <div v-for="post in list" :key="post._path">
      <p hover:text-primary m-0 mb-2>{{ post.title }}</p>
      <span>{{ post.description }}</span>
    </div>
  </ContentList>
</template>
