// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  content: {
    highlight: {
      theme: 'vitesse-light',
    }
  },
  
  modules: ['@nuxt/content', '@unocss/nuxt']
})
