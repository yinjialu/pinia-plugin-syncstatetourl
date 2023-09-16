import { Option } from './type'

export const normalizeOption = <T, K>(option: Option<T, K>): Required<Option<T, K>> => {
  const { key, serializer = { serialize: JSON.stringify, deserialize: JSON.parse }, debug = false } = option;
  return {
    key,
    serializer,
    debug,
  } as Required<Option<T, K>>;
};