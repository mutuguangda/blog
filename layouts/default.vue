<template>
  <div class="w-[65ch] lt-md:w-full mx-auto">
    <div flex justify-between items-center p-4 border-b border-b-solid border-b-black>
      <img src="" alt="logo">
      <nav flex gap-1>
        <ButtonLink>Blog</ButtonLink>
        <ButtonLink>Map</ButtonLink>
      </nav>
    </div>
    <main p-5>
      <slot />
    </main>
  </div>
</template>
