<script setup lang="ts">
import { reactive } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "ckeditor5-build-classic";
const state = reactive({
  editor: ClassicEditor,
  editorData: "",
  editorConfig: {
  } as import("@ckeditor/ckeditor5-core").EditorConfig,
});

defineEmits<{
  (e: 'change', value: string): void
}>()
</script>

<template>
  <CKEditor.component :editor="state.editor" v-model="state.editorData" :config="(state.editorConfig as any)"
    @input="$emit('change', state.editorData)" />
</template>