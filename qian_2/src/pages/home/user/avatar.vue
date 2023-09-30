<template>
  <div class="changePic-container">
    <el-card class="box-card">
      <template #header>
        <el-text type="primary" size="large">更换头像</el-text>
      </template>
      <div>
        <!-- 上方核心功能部分 -->
        <div class="core-box">
          <!-- 左侧裁剪部分 -->
          <div class="cropper">
            <VueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType"
              :info="option.info" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox"
              :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime"></VueCropper>
          </div>
          <!-- 右侧预览部分 -->
          <div class="preview-box">
            <!-- 图片 -->
            <div class="preview">
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img" />
              </div>
            </div>
            <!-- 更换头像 -->
            <div class="flex justify-center">
              <el-upload action="" :show-file-list="false" :auto-upload="false" @change="uploadImg">
                <el-button size="small" type="primary"> 更换头像 </el-button>
              </el-upload>
            </div>
            <br />
            <!-- 各种操作 -->
            <div>
              <el-button :icon="Plus" circle @click="changeScale(1)"></el-button>
              <el-button :icon="Minus" circle @click="changeScale(-1)"></el-button>
              <el-button :icon="Download" circle @click="down('blob')"></el-button>
              <el-button :icon="RefreshLeft" circle @click="rotateLeft"></el-button>
              <el-button :icon="RefreshRight" circle @click="rotateRight"></el-button>
            </div>
          </div>
        </div>
        <!-- 下方按钮选择部分区域 -->
        <div class="btn-box">
          <el-button type="primary" :icon="Plus" @click="chooseImg">选择图片</el-button>
          <el-button type="success" :icon="Upload" :disabled="user_pic === ''" @click="updateImg">上传头像</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { updateAvatarAPI } from '@/api'
import { useFileDialog, watchOnce } from '@vueuse/core'
const { files, open: openFD } = useFileDialog()
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper';
import { reactive } from 'vue';
import { ref } from 'vue';
import { /*ElMessage,*/ UploadFile } from 'element-plus';
// import { useUserStore } from '@/store';
import { Plus, Upload, Minus, Download, RefreshLeft, RefreshRight } from '@element-plus/icons-vue';
const cropper = ref<typeof VueCropper>()
// const userStore = useUserStore()
const user_pic = ref("")
const previews = ref({
  div: {},
  url: "",
  img: {}
})
const option = reactive({
  img: '/avatar.jpg', // 裁剪图片的地址
  info: true, // 裁剪框的大小信息
  outputSize: 1, // 剪切后的图片质量（0.1-1）
  full: true, // 输出原图比例截图 props名full
  outputType: 'png', // 裁剪生成额图片的格式
  canMove: true, // 能否拖动图片
  original: false, // 上传图片是否显示原始宽高
  canMoveBox: true, // 能否拖动截图框
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 150,
  autoCropHeight: 150,
  fixedBox: true, // 截图框固定大小
  size: 300
});
function chooseImg() {
  // 模拟点击行为
  openFD({
    accept: "image/*"
  })
  watchOnce(files, (val) => {
    if (val) {
      const file = val[0]
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = (e) => {
        user_pic.value = (<any>e.target).result // 显示上传图片按钮的标识
        option.img = (<any>e.target).result
      }
    }
  })
}

async function updateImg() {
  updateAvatarAPI(user_pic.value)

}
function uploadImg(file: UploadFile) {
  const reader = new FileReader()
  // 转化为base64
  reader.readAsDataURL(<Blob>file.raw)
  // 转化为blob
  reader.onload = (e) => {
    const data = <string>e.target?.result
    user_pic.value = data // 显示上传图片按钮的标识
    option.img = data
  }
}

// 1、实时预览函数
function realTime(data: typeof previews.value) {
  previews.value = data
}

// 2、五大附属功能
// ①、放大/缩小
function changeScale(num: number = 1) {
  num = num
  cropper.value.changeScale(num)
}
// ②、左旋转
function rotateLeft() {
  cropper.value.rotateLeft()
}
// ③、右旋转
function rotateRight() {
  cropper.value.rotateRight()
}
// ④、下载图片
function down(type: string) {
  const aLink = document.createElement('a')
  aLink.download = 'author-img'
  if (type === 'blob') {
    cropper.value.getCropBlob((data: Blob) => {
      aLink.href = window.URL.createObjectURL(data)
      aLink.click()
    })
  } else {
    cropper.value.getCropData((data: string) => {
      aLink.href = data
      aLink.click()
    })
  }
}
</script>
<style lang="scss" scoped>
// 上方
.core-box {
  width: 600px;
  height: 300px;

  .cropper {
    float: left;
    width: 50%;
    height: 100%;
  }

  .preview-box {
    float: right;
    width: 40%;
    height: 100%;
    text-align: center;
    padding: 20px 30px;

    .preview {
      width: 150px;
      height: 150px;
      margin: 0px auto 20px auto;
      border-radius: 50%;
      border: 1px solid #ccc;
      background-color: #ccc;
      overflow: hidden;
    }
  }
}

// 下方
.btn-box {
  margin-top: 20px;
  display: block;
}
</style>
