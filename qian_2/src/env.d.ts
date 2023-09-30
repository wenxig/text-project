/// <reference types="vite/client" />
export
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component

}
declare module "vue" {
  interface ComponentCustomProperties {
    $formatDate(date: Parameters<typeof dayjs>[0]): string
  }
}
declare module 'vue-cropper'