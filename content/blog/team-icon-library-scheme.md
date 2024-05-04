---
title: 团队图标库方案
date: 2024-01-24
---

## 结论

先介绍一下我待的团队的前端基础设施，代码库使用社区版的 GitLab，部署在内网上；UI 设计工具使用即时设计。

大概方案是，UI 通过即时设计的插件将图标上传到 GitLab，前端使用 UnoCSS 的[自定义 Icons 解析器](https://unocss.dev/presets/icons#filesystemiconloader)调用 GitLab API 获得图标。

## 心路历程

我所在的团队规模并不大，不过对应开发的产品倒是蛮多。负责了三四个项目，几乎所有产品我也参与过开发。

其实从需求上来说，最好的方案是采用市面上开源且完善的图标库，不过在流程不完善的情况下，前端这边遇到的最大问题是 UI 返工，经常性的某处细节需要调整。好比如说，图标的修改。眼挑的领导总是能看出很多问题，而图标的交付流程太过于原始，UI 在即时设计上画好后，前端去将其一个个切图导出，如果老是这样，会让我觉得自己是一个纯粹的切图仔。

我很喜欢 UnoCSS，从社区上得知并使用，而后在原作者 Anthony 的一篇博文[重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh)了解其具体设计思路。因为我先前使用 Iconify 较多，Iconify 可以选择[自托管 API](https://iconify.design/docs/api/hosting-js/)，这给了我一个启发，而 UnoCSS 具备自定义 Icons 解析器的功能，相比于 Iconify 来说还自由一点。于是很快的，我脑子便有一个自动化的思路。图标放在哪里都无所谓，只要能提供网络服务即可，那么根据团队的基础配套设施，放在 GitLab 上是非常合理的，加上是内网的应用，所有相关操作只需要调用 GitLab API 就可以实现。

## 实现步骤

基本思路想明白了，实现其实并不困难，但走完这一流程还是比较繁琐的。

### 即时设计插件

首先是开发一个即时设计的插件，可以让 UI 上传图标到 GitLab 仓库。即时设计官方没有提供 Vue 的模板，为此写了一个即时设计插件的 Vue 启动模板 [jsdesign-plugin-starter](https://github.com/mutuguangda/jsdesign-plugin-starter)。

因为考虑安全性，即时设计想要发送请求必须使用 HTTPS 协议，而内网的 GitLab 是使用 HTTP，跟运维的同事沟通无果后，考虑用 nginx 起一个 HTTPS 服务反代 GitLab API。

这里遇到一个问题卡了我很久。GitLab 部分 API 需要对 URL 进行编码操作，然而 nginx 会对 URL 自动解码，最后在 [Stack Overflow](https://stackoverflow.com/questions/28684300/nginx-pass-proxy-subdirectory-without-url-decoding/37584637#37584637) 找到答案。

```
location /gitlab-api/ {
    rewrite ^ $request_uri;
    rewrite ^/gitlab-api/(.*) $1 break;
    return 400;
    proxy_pass http://192.168.0.151:8080/api/v4/$uri;
}
```

还有一个问题是，因为团队的 GitLab 是内网的，所以 UI 需要下载即时设计客户端才可以使用这个插件。

### 图标库设计

在我的设想中，该仓库作为 UnoCSS Icon 的网络存储库就可以了。不过我的 Leader 认为它也应该具备一个正常图标库的功能，支持通过 npm 包的方式在项目中使用。核心逻辑如下：

```vue
<script setup lang="ts">
import { PropType, ref, watch } from 'vue'

const props = defineProps({
  icon: {
    type: String,
  },
  type: {
    type: String as PropType<'regular' | 'solid' | 'light'>,
    default: 'regular'
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
})

const iconCollection = import.meta.glob('./icons/**/*.svg', { as: 'raw' })
const realIcon = ref('')

watch(() => props.icon, async () => {
  realIcon.value = await iconCollection[`./icons/${props.type}/${props.icon}.svg`]()
}, { immediate: true })
</script>

<template>
  <span
    :style="{
      display: 'inline-block',
      fontSize: `${props.size}px`,
      lineHeight: `${props.size}px`,
      height: `${props.size}px`,
      color: props.color,
      flexShrink: 0,
      flexGrow: 0,
    }"
    v-html="realIcon"
  />
</template>
```

### 配套文档

一开始想使用 [unpkg](https://github.com/mjackson/unpkg) 搭建 CDN，这样可以很方便的根据 npm 包的版本去搜索图标，达到支持按版本索引图标的目的。然而这被我的 Leader 废弃掉了，他认为没有必要去为了图标库而搭建一个 CDN，得不偿失。最后还是通过 GitLab API 将图标库的文档内嵌到团队的前端站点。

## 总结

权当记录，如有疑问，欢迎邮箱与我交流。

## 参考文章

1. [使用 Figma + GitHub Actions 完成 SVG 图标的完全自动化交付 - 少数派 (sspai.com)](https://sspai.com/post/61182)
2. [ICON 图标库交付-我们有了最友好的方案 - 掘金 (juejin.cn)](https://juejin.cn/post/7043981084857466893)
3. [Using Figma designs to build the Octicons icon library - The GitHub Blog](https://github.blog/2018-04-12-driving-changes-from-designs/)
