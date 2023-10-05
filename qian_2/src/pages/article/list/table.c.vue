<script setup lang='ts'>
defineProps<{
  showDetailFn: (date: number) => void
  removeArticleFn: (date: number) => void
  artList: any[]
}>()



</script>

<template>
  <el-table :data="artList" style="width: 100%" border stripe>
    <el-table-column label="文章标题" prop="title">
      <template #default="{ row }">
        <el-link type="primary" @click="showDetailFn(row.pub_date)">{{
          row.title
        }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="分类" prop="cate_name" #default="{ row }">{{ row.cate_id || "无分类" }}</el-table-column>
    <el-table-column label="发表时间" prop="pub_date">
      <template #default="{ row }">
        <span>{{ $formatDate(row.pub_date) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="state"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="danger" size="small" @click="removeArticleFn(row.pub_date)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>