import { defineStore, StateTree } from 'pinia';
import { useUrlSearchParams } from '@vueuse/core';

export const useUrlSearchParamsStore = defineStore('urlSearchParamsStore', () => {
  const params = useUrlSearchParams('history');
  const updateParams = (s: StateTree) => {
    Object.assign(params, s);
  };
  return {
    params,
    updateParams,
  };
});
