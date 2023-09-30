<script setup lang='ts'>
import ActcetaEdit from '@/components/actcetaEdit.vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import defaultImg from '/cover.jpg'
import type { FormRules, FormInstance } from 'element-plus';
import { uploadArticleAPI } from '@/api';
const props = defineProps<{
  getArtListFn: () => void,
  cateList: any[]
}>()
const pubForm = reactive({
  title: '',
  cate_id: '',
  content: '',
  cover_img: '', // b64
  state: '' // 文章的发布状态，可选值有两个：草稿、已发布
})
const pubFormRules = reactive<FormRules<typeof pubForm>>({
  // 表单的验证规则对象
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    {
      min: 1,
      max: 30,
      message: '文章标题的长度为1-30个字符',
      trigger: 'blur'
    }
  ],
  cover_img: [
    // 这里的图片校验和前面的富文本器校验一样的解决方法（单独校验）
    { required: true, message: '请选择封面', trigger: 'blur' }
  ]
})
let getValue: (() => string) | null


const iptFileRef = ref<HTMLInputElement>()
function chooseImgFn() {
  iptFileRef.value?.click()
}
const pubFormRef = ref<FormInstance>()
function onCoverChangeFn(e: Event) {
  const files = <File[]>(<any>e.target).files
  if (files.length === 0) {
    pubForm.cover_img = ""
    pubForm.cover_img = defaultImg
  } else {
    // 用户选择了封面
    const fr = new FileReader()
    fr.readAsDataURL(files[0])
    fr.onload = (eve) => {
      if (!eve.target) {
        return
      }
      pubForm.cover_img = <string>eve.target.result
    }
  }
  pubFormRef.value?.validateField('cover_img')
}

function pubArticleFn(str: string) {
  // 1. 设置发布状态
  pubForm.state = str

  // // 2. 表单预校验（兜底校验）
  pubFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (!getValue) {
        return
      }
      // 发起请求
      uploadArticleAPI({
        cover_img: pubForm.cover_img,
        article: getValue(),
        title: pubForm.title,
        cate_id: pubForm.cate_id ?? 0,
        state: pubForm.state
      })
      // if (res.code !== 0) {
      //   ElMessage.error('发布文章失败！')
      // } else {
      //   ElMessage.success('发布文章成功！')

      //   // 关闭对话框
      //   pubdialogVisible = false

      //   // 刷新主页面文章列表数据
      props.getArtListFn()
      // }
    } else {
      return false
    }
  })
}

</script>

<template>
  <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="文章分类" prop="cate_id">
      <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
        <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="正文内容" prop="content">
      <ActcetaEdit @getGetCtnFn="(value) => getValue = value"></ActcetaEdit>
    </el-form-item>
    <el-form-item label="文章封面" prop="cover_img">
      <img :src="pubForm.cover_img" alt="" class="cover-img" ref="imgRef" />
      <br />
      <input type="file" style="display: none" accept="image/*" ref="iptFileRef" @change="onCoverChangeFn" />
      <el-link type="primary" @click="chooseImgFn" :underline="false">+ 选择封面</el-link>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
      <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang='scss'>
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
</style>