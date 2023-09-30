<script setup lang='ts'>
import { UserFilled } from '@element-plus/icons-vue'
import { isEmpty } from 'lodash';

defineProps<{
  src?: string,
  size?: number
}>()
</script>

<template>
  <el-avatar :size="size ?? 35" fit="cover">
    <template #default>
      <el-icon :size="(size ?? 35) - 10" v-if="isEmpty(src)" class="!m-0">
        <UserFilled />
      </el-icon>
      <el-image v-else :src="src" fit="cover" class="!flex !items-center !justify-center"></el-image>
    </template>
  </el-avatar>
</template>