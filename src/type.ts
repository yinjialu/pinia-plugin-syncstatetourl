export type Serializer<T = any> = {
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
};

export type Option<T = unknown, K = string> = {
  key: K; // 指定同步到链接的字段名
  serializer?: Serializer<T>;
  debug?: boolean;
};

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    /**
     * sync store in Url
     */
    // todo 限制 key keyof S 的基础上，再限制其为字符串
    syncToUrl?: Option<S>[];
  }
}