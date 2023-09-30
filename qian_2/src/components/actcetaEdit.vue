<script setup lang="ts">
import { reactive } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "ckeditor5-build-classic";
const state = reactive({
  editor: ClassicEditor,
  context: "",
  editorConfig: {
  } as import("@ckeditor/ckeditor5-core").EditorConfig,
});

const emit = defineEmits<{
  (e: 'getGetCtnFn', value: () => string): void
}>()
emit("getGetCtnFn", () => {
  return state.context
})
</script>

<template>
  <CKEditor.component :editor="state.editor" v-model:model-value="state.context" :config="(state.editorConfig as any)" />
</template>