import AsyncStorage from '@react-native-async-storage/async-storage'
import debounce from 'lodash.debounce'
import { createAsyncStoragePersistor } from 'react-query/createAsyncStoragePersistor-experimental'

import { PersistedClient } from 'react-query/types/persistQueryClient-experimental'

const debouncedStringify = debounce(JSON.stringify, 2000)

export const persistor = createAsyncStoragePersistor({
  storage: AsyncStorage,
  serialize: (client: PersistedClient) => debouncedStringify(client) || '',
})
