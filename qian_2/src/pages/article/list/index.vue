<template>
  <div class="articlList-container">
    <el-card>
      <template #header>
        <el-text type="primary" size="large">文章列表</el-text>
      </template>
      <SearchBox :cate-list="cateList" :get-art-list-fn="getArtListFn" :q="q" :resetChooseFn="resetChooseFn"
        v-model:pubdialog-visible="pubdialogVisible" />
      <Table :art-list="artList" v-loading="lodingTabel" :show-detail-fn="showDetailFn"
        :remove-article-fn="removeArticleFn" />
      <el-pagination @size-change="(newSize) => { q.pagesize = newSize; q.pagenum = 1 }"
        @current-change="(newPage) => q.pagenum = newPage" :current-page.sync="q.pagenum" :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="发表" v-model="pubdialogVisible" fullscreen>
      <EditArea :cate-list="cateList" :getArtListFn="getArtListFn" />
    </el-dialog>
    <Suspense>
      <el-dialog title="文章预览" v-model="detailVisible" center width="80%" destroy-on-close>
        <Preview :art-detail="artDetail" :loding="loding.value" />
      </el-dialog>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import {
  getArtCateListAPI,
  getArticleDetailFn,
  delArticleAPI,
  getArticleListAPI
} from '@/api'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { reactive } from 'vue';
import { ref } from 'vue';
import { watch } from 'vue';
import EditArea from './upload.c.vue';
import Preview from './preview.c.vue';
import Table from './table.c.vue';
import SearchBox from './searchBox.c.vue';
const cateList = ref<any[]>([])
const q = reactive({
  pagenum: 1, // 默认显示第一页数据
  pagesize: 5, // 默认当前页显示几条数据
  cate_id: '',
  state: ''
})
const artList = ref<any[]>([])
const total = ref(0)
const pubdialogVisible = ref(false)
const detailVisible = ref(false)
const artDetail = ref<Record<any, any>>({})
const lodingTabel = ref(true)
getCateListFn()
getArtListFn().finally(() => {
  lodingTabel.value = false
})
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


watch(q, () => {
  getArtListFn()
})

function resetChooseFn() {
  q.cate_id = ''
  q.pagesize = 5
  q.state = ''
  q.pagenum = 1
}

const loding: { value?: ReturnType<typeof ElLoading.service> } = reactive({ value: undefined })
async function showDetailFn(date: number) {
  loding.value = ElLoading.service({
    text: "加载中",
  })
  const { data: res } = await getArticleDetailFn(date)
  if (res.code !== 0) return ElMessage.error('获取文章详情失败!')
  artDetail.value = res.data
  // 展示文章详情对话框
  detailVisible.value = true
}

async function removeArticleFn(date: number) {
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
  const { data: res } = await delArticleAPI(date)

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
