<template>
  <!-- @vue-ignore -->
  <RouterLink v-bind="$attrs" class="btn-link">
    <slot />
  </RouterLink>
</template>

<style>
.btn-link {
  color: var(--text);
  position: relative;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
  padding: 0.25rem 0.5rem;
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
  width: 100%; /* 下划线宽度 */
}

.btn-link:hover {
  color: var(--primary); /* 鼠标悬停时文本颜色 */
}
</style>
