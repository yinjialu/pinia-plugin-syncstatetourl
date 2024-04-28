# 主要功能

* 将页面的状态同步到链接上，支持分享

# 使用方式

```shell
npm i --save pinia-plugin-syncstatetourl
```

## 安装插件

```ts
import { createPinia } from 'pinia'
import { PiniaPluginSyncStateToUrl } from 'pinia-plugin-syncstatetourl'

const pinia = createPinia()
pinia.use(PiniaPluginSyncStateToUrl)
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

### 自定义在链接中的格式逻辑

默认使用 JSON.stringify 转换状态为字符串到链接，使用 JSON.parse 解析链接上的内容，转换为状态，可以满足大部分场景
如果希望自定义链接中的数据格式，可以自定义 serializer 方法，参考如下：

```js
import { ref } from 'vue';
import { defineStore } from 'pinia'
import { serializerForString } from 'pinia-plugin-syncstatetourl'
import { dayjs } from 'dayjs'
export const useStateStore = defineStore('state', () => {
  const str = ref('str')
  const day = ref(dayjs())
  return {
    str,
    day
  }
}, {
  syncToUrl: [
    { key: 'str', serializer: serializerForString } // 避免链接中字符串值带有引号
    { key: 'day', serializer: { // 格式化时间，转化为更易读的格式
      serialize(v) {
        return v.format('YYYY-MM-DD HH:mm:ss');
      },
      deserialize(v) {
        return dayjs(v, 'YYYY-MM-DD HH:mm:ss')
      }
    } },
  ]
})
```

### 切换页面后参数没有同步到链接

插件会在第一次调用 useStore 时执行，会默认同步一次状态到链接，在切换页面后，store 已经完成了初始化，在新页面上除非状态发生变更，否则不会主动同步状态到链接
为实现此功能，可以在路由切换到新页面后，手动同步一次

```js
useStateStore.$syncStateToUrl()
```

如果不希望维护 syncStateToUrl 的调用逻辑，可以使用 `createUseStoreWithSyncStateToUrl` 对 useStore 进行封装

```js
import { createUseStoreWithSyncStateToUrl } from 'pinia-plugin-syncstatetourl'

export const useStateStoreWithSyncStateToUrl = createUseStoreWithSyncStateToUrl(useStateStore)

// useStateStoreWithSyncStateToUrl 的使用姿势和 useStateStore 完全一样，只是每次调用 useStateStoreWithSyncStateToUrl 会自动调用一次 $syncStateToUrl()

```

## 原理

* 在链接上存在相应的字段时，更新 store 覆盖对应字段的默认值，支持通过分享链接进入回填参数
* 当链接上不存在相应的字段时，将 store 上的默认值更新到链接
* 当 store 更新时，将对应字段的最新值更新到链接，链接可以用于分享或者刷新以始终保存当前 store 状态

## TODO

* 优化 serialize 类型提示

## 拓展

* 数据持久化：[pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate)
* 【注意】，当和 pinia-plugin-persistedstate 一起使用时候，建议先注册 pinia-plugin-persistedstate 插件，后注册 pinia-plugin-syncstatetourl 插件，以确保当同时对一个状态应用上面两个插件时，链接上的信息有更高的优先级