import type { Option, Serializer } from './type'

export type { Serializer };

export const normalizeOption = <S, K extends keyof S = keyof S>(option: Option<S, K>): Required<Option<S, K>> => {
  const { key, serializer = { serialize: JSON.stringify, deserialize: JSON.parse }, debug = false } = option;
  return {
    key,
    serializer,
    debug,
  } as Required<Option<S, K>>;
};

export const serializerForString: Serializer<string> = {
  serialize(v) {
    return v;
  },
  deserialize(v) {
    return v;
  },
};