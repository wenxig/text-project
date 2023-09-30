<template>
  <div class="articlList-container">
    <el-card class="box-card">
      <template #header>
        <el-text type="primary" size="large">文章列表</el-text>
      </template>
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
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
        <el-button type="primary" size="small" class="btn-pub" @click="pubdialogVisible = true">发表文章</el-button>
      </div>
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template #slot="{ row }">
            <el-link type="primary" @click="showDetailFn(row.id)">{{
              row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template #slot="{ row }">
            <span>{{ $formatDate(row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template #slot="{ row }">
            <el-button type="danger" size="small" @click="removeArticleFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="(newSize) => { q.pagesize = newSize; q.pagenum = 1 }"
        @current-change="(newPage) => q.pagenum = newPage" :current-page.sync="q.pagenum" :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="发表" v-model="pubdialogVisible" fullscreen>
      <EditArea :cate-list="cateList" :getArtListFn="getArtListFn" />
    </el-dialog>
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <Preview :art-detail="artDetail"/>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  getArtCateListAPI,
  getArticleListAPI,
  getArticleDetailFn,
  delArticleAPI
} from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive } from 'vue';
import { ref } from 'vue';
import { watch } from 'vue';
import EditArea from './upload.c.vue';
import Preview from './preview.c.vue';
const cateList = ref<any[]>([])
const artList = ref<any>([])
const q = reactive({
  pagenum: 1, // 默认显示第一页数据
  pagesize: 5, // 默认当前页显示几条数据
  cate_id: '',
  state: ''
})
const total = ref(0)
const pubdialogVisible = ref(false)
const detailVisible = ref(false)
const artDetail = ref<Record<any, any>>({})

getCateListFn()
getArtListFn()

async function getCateListFn() {
  const { data: res } = await getArtCateListAPI()
  cateList.value = res.data
}

async function getArtListFn() {
  const { data: res } = await getArticleListAPI(q)
  if (res.code !== 0) return ElMessage.error('获取文章列表失败!')
  artList.value = res.data
  total.value = res.total
}


watch(() => q.pagenum, () => {
  getArtListFn()
})

function resetChooseFn() {
  q.cate_id = ''
  q.pagesize = 5
  q.state = ''
  q.pagenum = 1
}

async function showDetailFn(id: string) {
  const { data: res } = await getArticleDetailFn(id)
  if (res.code !== 0) return ElMessage.error('获取文章详情失败!')
  artDetail.value = res.data
  // 展示文章详情对话框
  detailVisible.value = true
}

async function removeArticleFn(id: string) {
  // 1. 询问用户是否要删除
  const confirmResult = await ElMessageBox.confirm(
    '此操作将永久删除该文件, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).catch((err) => err)

  // 2. 取消了删除
  if (confirmResult === 'cancel') return

  // 执行删除的操作
  const { data: res } = await delArticleAPI(id)

  if (res.code !== 0) return ElMessage.error('删除文章失败!')
  ElMessage.success('删除文章成功!')
  // 刷新列表数据
  getArtListFn()
}
</script>
<style lang="scss" scoped>
.articlList-container {
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .btn-pub {
      margin-top: 5px;
    }
  }
}

// 文章列表样式
.el-pagination {
  margin-top: 15px;
}


:global(.ck-editor) {
  width: 100% !important;
}

:global(.ck-sticky-panel__content_sticky) {
  position: static !important;
}
</style>
