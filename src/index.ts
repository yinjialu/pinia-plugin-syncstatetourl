import { PiniaPlugin, StateTree, SubscriptionCallbackMutation, StoreDefinition, Store } from 'pinia';
import debounce from 'lodash/debounce';
import { computed, unref } from 'vue';
import { normalizeOption } from './utils';
import { useUrlSearchParamsStore } from './store/useUrlSearchParamsStore'

export const PanelPluginSyncStateToUrl: PiniaPlugin = (context) => {
  // 获取到 options 配置
  const {
    options: { syncToUrl },
    store,
  } = context;

  if (!syncToUrl) return;

  // 标准化配置
  const urlSearchParamsStore = useUrlSearchParamsStore()
  const query = computed(() => urlSearchParamsStore.params);
  const syncToUrlOptions = syncToUrl.map(normalizeOption);
  // 读
  const read = () => {
    return syncToUrlOptions.reduce((m, o) => {
      const { key, serializer, debug } = o;
      try {
        const valueFromUrl = unref(query)[key as string] as string; // todo 这里有一些边界 case，比如返回的内容可能是数组
        if (valueFromUrl) {
          m[key] = serializer.deserialize(valueFromUrl);
        }
      } catch (error) {
        if (debug) {
          console.error(error);
        }
      }
      return m;
    }, {} as StateTree); // 获取当前 state 的类型
  };

  // 写
  const write = debounce((v: StateTree) => {
    const syncToUrlValue = syncToUrlOptions.reduce((m, o) => {
      const { key, serializer, debug } = o;
      try {
        m[key] = serializer.serialize(v[key]);
        return m;
      } catch (error) {
        if (debug) {
          console.error(error);
        }
      }
      return m;
    }, {} as StateTree);

    urlSearchParamsStore.updateParams(syncToUrlValue)
  }, 50);

  // 从url上读取内容用于 state 初始化
  const initValue = read(); // 获取初始值
  store.$patch(initValue);

  // 当路由上缺少相关字段初始值时做一次写入同步
  if (
    syncToUrlOptions.some((option) => {
      const { key } = option;
      if (!initValue[key] && store[key]) return true;
    })
  ) {
    write({ ...store, ...initValue });
  }

  // 支持手动同步状态到路由
  store.$syncStateToUrl = () => {
    write(store);
  };

  // 监听状态变更同步到 url
  store.$subscribe((_mutation: SubscriptionCallbackMutation<StateTree>, state: StateTree) => {
    // todo 判断过滤是有配置的变量变化才同步
    write(state);
  });
};

export function createUseStoreWithSyncStateToUrl<Id extends string, S extends StateTree, G, A>(
  storeDefinition: StoreDefinition<Id, S, G, A>
): StoreDefinition<Id, S, G, A> {
  type P = Parameters<StoreDefinition<Id, S, G, A>>;
  const newUseStore = (...p: P): Store<Id, S, G, A> => {
    const store = storeDefinition(...p);
    store.$syncStateToUrl();
    return store;
  };
  newUseStore.$id = storeDefinition.$id;
  return newUseStore;
}
