<script setup lang='ts'>
import req from '@/utils/axios'
import ArtView from '@/components/artView.vue';
import { ref } from 'vue';
import { ElLoading } from 'element-plus';
import { onMounted } from 'vue';
const props = defineProps<{
  artDetail: Record<string, any>,
  loding?: ReturnType<typeof ElLoading.service>
}>()
const imgValue = ref((await req({
  url: '/uploads' + props.artDetail.cover_img
})).data)
const actValue = ref((await req({
  url: '/uploads' + props.artDetail.article
})).data)
onMounted(() => {
  props.loding?.close()
})
console.log('ásdsddfsfddfsdfsdfdfsfd');

</script>

<template>
  <h1 class="text-2xl text-center font-normal text-black m-0 !mb-[10px]">{{ artDetail.title }}</h1>
  <div class="text-base mb-[20px]">
    <span class="mr-1">作者:{{ artDetail.nickname || artDetail.username }}</span>
    <span class="mr-1">发布时间:{{ $formatDate(artDetail.pub_date) }}</span>
    <span class="mr-1">所属分类:{{ artDetail.cate_name }}</span>
    <span class="mr-1">状态:{{ artDetail.state }}</span>
  </div>
  <el-divider></el-divider>
  <img :src="imgValue" alt="cover_img" />
  <el-divider></el-divider>
  <ArtView :text="actValue.toString()" />
</template>