import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersistor } from 'react-query/createAsyncStoragePersistor-experimental'

import { env } from 'libs/environment'

export const persistor = createAsyncStoragePersistor({
  key: 'REACT_QUERY_OFFLINE_CACHE_' + env.ENV,
  storage: AsyncStorage,
})
