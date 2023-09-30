<script setup lang='ts'>
import Layout from '@/layout/index.vue';
</script>

<template>
  <Layout>
    <template #default>
      <ElMain>
        <RouterView></RouterView>
      </ElMain>
    </template>
  </Layout>
</template>