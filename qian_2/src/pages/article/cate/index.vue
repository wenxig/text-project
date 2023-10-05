<template>
  <!-- 预览文章分类 -->
  <el-card>
    <template #header>
      <div class="header-box">
        <el-text type="primary" size="large">文章分类</el-text>
        <el-button type="primary" @click="addCateBtnFn">添加分类</el-button>
      </div>
    </template>
    <!-- 使用element-ui的table组件 -->
    <el-table :data="cateList" style="width: 100%" border stripe>
      <el-table-column label="序号" type="index" width="100">
      </el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column align="操作">
        <template v-slot="{ row }">
          <el-button size="small" type="primary" @click="updateCateBtnFn(row)">修改</el-button>
          <el-button size="small" type="danger" @click="deleteCateBtnFn(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 添加、修改文章分类-对话框 -->
  <el-dialog title="提示" v-model="dialogVisible" width="800px" @closed="() => addRef?.resetFields()">
    <!-- 内部表单区域 -->
    <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="() => dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmFn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getArtCateListAPI,
  addArtCateAPI,
  delArtCateAPI
} from '@/api'
import { ElMessage as $message, type FormInstance, type FormRules } from 'element-plus';
import { nextTick, reactive, ref } from 'vue';
const cateList = ref<any[]>([])
const dialogVisible = ref(false)
const addRef = ref<FormInstance>()
let isEdit = false
let editId = ''
const addForm = reactive({
  cate_name: '',
  cate_alias: ''
})
const addRules = reactive<FormRules>({
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
})

const initCateListFn = async () => {
  const res = await getArtCateListAPI()
  cateList.value = res.data.data
}

initCateListFn()

function confirmFn() {
  // 表单校验
  addRef.value?.validate(async (valid) => {
    if (valid) {
      if (isEdit) {
        // 更改 == 删除+添加
        //@ts-ignore
        const { data: del } = await delArtCateAPI(editId)
        //@ts-ignore
        const { data: add } = await addArtCateAPI({
          id: editId,
          ...addForm
        })
        // 请求成功、失败提示
        if (del.code !== 0 && add.code !== 0) return $message.error("失败")
        $message.success('成功')
      } else {
        // + 新增操作
        const { data: res } = await addArtCateAPI(addForm)
        // 请求成功、失败提示
        if (res.code !== 0) return $message.error(res.message)
        $message.success(res.message)
        // 重新请求列表数据
        initCateListFn()
      }
      // 刷新列表数据 并 关闭对话框
      initCateListFn()
      dialogVisible.value = false
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

function addCateBtnFn() {
  // 标记状态
  isEdit = false
  editId = ''

  dialogVisible.value = true
}
function updateCateBtnFn(obj: any) {
  // 标记状态
  isEdit = true
  editId = obj.id

  // 实现数据回显
  dialogVisible.value = true
  // 解决点击修改按钮，后点击添加按钮时数据回显的小bug
  nextTick(() => {
    addForm.cate_name = obj.cate_name
    addForm.cate_alias = obj.cate_alias
  })
  return false
}
async function deleteCateBtnFn(obj: { id: any; }) {
  const { data: res } = await delArtCateAPI(obj.id)
  // 请求成功、失败提示
  if (res.code !== 0) return $message.error('删除分类失败！')
  $message.success('删除分类成功！')
  // 重新请求列表数据
  initCateListFn()
}
</script>

<style lang="scss" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
