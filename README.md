# 主要功能

* 在链接上存在相应的字段时，更新 store 覆盖对应字段的默认值，支持通过分享链接进入回填参数
* 当链接上不存在相应的字段时，将 store 上的默认值更新到链接
* 当 store 更新时，将对应字段的最新值更新到链接，链接可以用于分享或者刷新以始终保存当前 store 状态

# 使用方式

```shell
npm i --save pinia-plugin-syncstatetourl
```

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
  return {
    number,
    str
  }
}, {
  syncToUrl: [
    { key: 'number' },
    { key: 'str' }
  ]
})
```
