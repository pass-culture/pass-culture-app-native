import AsyncStorage from '@react-native-async-storage/async-storage'
// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

type Options = {
  persist?: boolean
}

type Params<State> = {
  name: string
  defaultState: State
  options?: Options
}

export const createConfiguredStore = <State>({ name, defaultState, options }: Params<State>) => {
  const store = () => defaultState
  const persistedStore = persist(store, {
    name,
    storage: createJSONStorage(() => AsyncStorage),
  })

  return create<State>()(
    devtools(options?.persist ? persistedStore : store, { enabled: false, name })
  )
}
