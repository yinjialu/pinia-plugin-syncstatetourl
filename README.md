# 使用方式

## 安装插件

```ts
import { createPinia } from 'pinia'
import { PanelPluginSyncStateToUrl } from 'pinia-plugin-syncstatetourl'

const pinia = createPinia()
pinia.use(PanelPluginSyncStateToUrl)
```

## 使用

```ts
import { ref } from 'vue';
import { defineStore } from 'pinia'
export const useStateStore = defineStore('state', () => {
  const number = ref<number>(1);
  const str = ref('str')
}, {
  syncToUrl: [
    { key: 'number' },
    { key: 'str' }
  ]
})
```