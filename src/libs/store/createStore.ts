import AsyncStorage from '@react-native-async-storage/async-storage'
// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

type Options = {
  persist?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't want to restrict the payload type
export const createStore = <State>(name: string, defaultState: State, options?: Options) => {
  const store = () => defaultState
  const persistedStore = persist(store, {
    name,
    storage: createJSONStorage(() => AsyncStorage),
  })

  return create<State>()(
    devtools(options?.persist ? persistedStore : store, { enabled: false, name })
  )
}
