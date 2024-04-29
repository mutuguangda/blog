<template>
  <ContentList path="/blog" v-slot="{ list }">
    <div v-for="post in list" :key="post._path">
      <h2 hover:text-primary>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
    </div>
  </ContentList>
</template>
