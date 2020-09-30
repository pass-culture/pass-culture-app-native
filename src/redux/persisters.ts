// @ts-ignore : TODO: write typing for redux-persist-sensitive-storage
import createSensitiveStorage from 'redux-persist-sensitive-storage'; // @redux-persist-sensitive
import AsyncStorage from '@react-native-community/async-storage'; // @redux-persist
import { persistReducer } from 'redux-persist'; // @redux-persist

const sensitiveStorage = createSensitiveStorage();

export const sensitivePersist = <T, K extends keyof T>(
  key: string,
  reducer: T,
  whitelist?: Array<K> // when undefined, persists the whole state ; when [], does not persist anything
) => {
  const config = { key, storage: sensitiveStorage, whitelist };
  // @ts-ignore TODO: fix typing for config
  return persistReducer(config, reducer);
};

export const localStoragePersist = <T, K extends keyof T>(
  key: string,
  reducer: T,
  whitelist?: Array<K> // when undefined, persists the whole state ; when [], does not persist anything
) => {
  const config = { key, storage: AsyncStorage, whitelist };
  // @ts-ignore TODO: fix typing for config
  return persistReducer(config, reducer);
};
