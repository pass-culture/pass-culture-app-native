import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient } from 'react-query'
import { createAsyncStoragePersistor } from 'react-query/createAsyncStoragePersistor-experimental'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'

import { env } from 'libs/environment'

const persistor = createAsyncStoragePersistor({
  key: `REACT_QUERY_OFFLINE_CACHE_${env.ENV}`,
  storage: AsyncStorage,
})

export const saveQueryClient = (queryClient: QueryClient) => {
  persistQueryClient({
    queryClient,
    persistor,
  })
}
