import { computed, watch, unref } from 'vue';
import { defineStore, StateTree } from 'pinia';
import { useRoute } from 'vue-router';
import { useUrlSearchParams } from '@vueuse/core';

export const useUrlSearchParamsStore = defineStore('urlSearchParamsStore', () => {
  const route = useRoute();
  const query = computed(() => route.query);
  const params = useUrlSearchParams('history');

  // 自动在路由变化时重置 params，未覆盖的场景可以手动调用 resetParams
  watch([() => route.name, () => route.params], () => {
    resetParams();
  }, {
    flush: 'sync'
  });

  // 路由切换 route.query 会更新，params 不会更新，所以这里使用 route.query 重置 params
  const resetParams = () => {
    const unusedKeys = new Set(Object.keys(params));
    Object.keys(unref(query)).forEach((k) => {
      (params as any)[k] = unref(query)[k];
      unusedKeys.delete(k);
    });
    Array.from(unusedKeys).forEach((key) => delete params[key]);
  };

  const updateParams = (s: StateTree) => {
    Object.assign(params, s);
  };
  return {
    resetParams,
    params,
    updateParams,
  };
});
