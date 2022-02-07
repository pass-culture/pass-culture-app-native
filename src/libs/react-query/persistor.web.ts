import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'

import { env } from 'libs/environment'

export const persistor = createWebStoragePersistor({
  key: 'REACT_QUERY_OFFLINE_CACHE_' + env.ENV,
  storage: window.localStorage,
})
