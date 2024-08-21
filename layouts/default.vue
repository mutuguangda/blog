<template>
  <div class="w-[65ch] lt-md:w-full mx-auto">
    <div flex justify-between items-center p-4 border-b border-b-solid border-b-black>
      <RouterLink to="/">
        <img w-8 h-8 rounded-full src="/logo.jpg" alt="logo">
      </RouterLink>
      <nav flex gap-2>
        <ButtonLink to="/blog">Blog</ButtonLink>
        <ButtonLink to="https://mm-khaki-two.vercel.app/preview">Map</ButtonLink>
      </nav>
    </div>
    <main p-5>
      <slot />
    </main>
    <footer p-4 text-xs>
      <span class="text-sm op50"><a target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" style="color:inherit">CC BY-NC-SA 4.0</a> 2024-PRESENT © King Judd</span>
    </footer>
  </div>
</template>
