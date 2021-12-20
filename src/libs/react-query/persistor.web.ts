import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'
import debounce from 'lodash.debounce'
import { PersistedClient } from 'react-query/types/persistQueryClient-experimental'

const debouncedStringify = debounce(JSON.stringify, 2000)

export const persistor = createWebStoragePersistor({
  storage: window.localStorage,
  serialize: (client: PersistedClient) => debouncedStringify(client) || '',
})
