<script setup lang="ts">
//@ts-ignore
import elZhCn from 'element-plus/dist/locale/zh-cn.mjs';

</script>

<template>
  <el-config-provider :locale="elZhCn">
    <RouterView class="!h-full" />
  </el-config-provider>
</template>
