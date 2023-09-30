<script setup lang='ts'>
import { baseURL } from '@/utils/axios'

defineProps<{
  artDetail: Record<string, any>
}>()

</script>

<template>
  <h1 class="text-2xl text-center font-normal text-black m-0 !mb-[10px]">{{ artDetail.title }}</h1>
  <div class="text-base">
    <span class="mb-[20px]">作者：{{ artDetail.nickname || artDetail.username }}</span>
    <span class="mb-[20px]">发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
    <span class="mb-[20px]">所属分类：{{ artDetail.cate_name }}</span>
    <span class="mb-[20px]">状态：{{ artDetail.state }}</span>
  </div>
  <el-divider></el-divider>
  <img :src="baseURL + artDetail.cover_img" alt="cover_img" />
  <iframe :srcdoc="`
    <!DOCTYPE html>
    <html lang='zh-cn'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>${artDetail.title}</title>
      </head>
      <body>
        ${artDetail.content}
      </body>
    </html>
  `" frameborder="0" :title="artDetail.title"></iframe>
</template>