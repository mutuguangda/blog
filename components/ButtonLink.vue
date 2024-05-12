<script setup lang="ts">
import type { RouteRecordRaw } from '#vue-router';
import isURL from 'validator/es/lib/isURL'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  to: RouteRecordRaw | string
}>()

const isExternalLink = computed(() => {
  if (typeof props.to !== 'string') return false
  return isURL(props.to)
})
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" class="btn-link is-external" :href="(props.to as unknown as string)" target="_blank">
    <span>
      <slot></slot>
    </span>
    <span i-heroicons-arrow-up-right transform translate-y-2px></span>
  </a>
  <RouterLink v-else v-bind="$attrs" class="btn-link" :to="props.to">
    <slot />
  </RouterLink>
</template>

<style scoped>
.btn-link {
  color: var(--text);
  position: relative;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
  padding: 0.25rem 0.5rem;
}

.btn-link.is-external {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: var(--primary);
  transition: width 0.3s;
  transform: translateX(-50%);
}

.btn-link:hover::after {
  width: 100%;
}

.btn-link:hover {
  color: var(--primary);
}
</style>
