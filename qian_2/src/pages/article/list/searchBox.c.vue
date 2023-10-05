<script setup lang='ts'>
defineProps<{
  q: any,
  cateList: any[]
  getArtListFn: () => void
  pubdialogVisible: boolean
  resetChooseFn: () => void
}>()
defineEmits<{
  'update:pubdialogVisible': [boolean]
}>()
</script>

<template>
  <div class="search-box">
    <el-form :inline="true" :model="q">
      <el-form-item label="文章分类">
        <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
          <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态" class="ml-[15px]">
        <el-select v-model="q.state" placeholder="请选择状态" size="small">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="getArtListFn()">筛选</el-button>
        <el-button type="info" size="small" @click="resetChooseFn">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" class="btn-pub"
      @click="$emit('update:pubdialogVisible', true)">发表文章</el-button>
  </div>
</template>