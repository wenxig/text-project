<template>
  <div v-html="markdown.render(text)" class="markdown-body"></div>
</template>

<script lang="ts" setup>
import "github-markdown-css/github-markdown.css"
//@ts-ignore
import MarkdownIt from "markdown-it";
import { reactive } from "vue";
//@ts-ignore
import MarkdownItAbbr from "markdown-it-abbr";
//@ts-ignore
import MarkdownItAnchor from "markdown-it-anchor";
//@ts-ignore
import MarkdownItFootnote from "markdown-it-footnote";
//@ts-ignore
import MarkdownItHighlightjs from "markdown-it-highlightjs";
//@ts-ignore
import MarkdownItSub from "markdown-it-sub";
//@ts-ignore
import MarkdownItSup from "markdown-it-sup";
//@ts-ignore
import MarkdownItTasklists from "markdown-it-task-lists";
//@ts-ignore
import MarkdownItTOC from "markdown-it-toc-done-right";
const markdown = reactive(MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})).use(MarkdownItAbbr)
  .use(MarkdownItAnchor)
  .use(MarkdownItFootnote)
  .use(MarkdownItHighlightjs)
  .use(MarkdownItSub)
  .use(MarkdownItSup)
  .use(MarkdownItTasklists)
  .use(MarkdownItTOC);

defineProps<{
  text: string
}>()
</script>

<style scoped lang='scss'>
.markdown-body {
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  padding: 45px;
}
</style>