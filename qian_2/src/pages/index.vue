<script setup lang='ts'>
import ActcetaEdit from '@/components/actcetaEdit.vue';
import { ref, watch } from 'vue';

const md = ref("")
watch(md, (v) => {
  console.log(v);
})
</script>

<template>
  <ActcetaEdit v-model:value="md" />
</template>