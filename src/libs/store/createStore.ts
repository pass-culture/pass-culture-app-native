import AsyncStorage from '@react-native-async-storage/async-storage'
// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { AnyFunction, CurriedAnyFunction, StoreConfig, Store } from './store.types'

export function createStore<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
>({
  name,
  defaultState,
  actions: createActions = createEmptyActions<Actions>,
  selectors = createEmptySelectors<Selectors>(),
  options,
}: StoreConfig<State, Actions, Selectors>): Store<State, Actions, Selectors> {
  const defaultStore = () => defaultState

  const persistedStore = persist(defaultStore, {
    name,
    storage: createJSONStorage(() => AsyncStorage),
  })

  const store = create<State>()(
    devtools(options?.persist ? persistedStore : defaultStore, { enabled: false, name })
  )

  const actions = createActions(store.setState)

  const select = <T>(selector: (state: State) => T): T => {
    const state = store.getState()
    return selector(state)
  }

  return {
    useStore: store,
    actions,
    selectors,
    select,
  }
}

const createEmptyActions = <T extends Record<string, AnyFunction>>(): T => Object.create(null)
const createEmptySelectors = <T extends Record<string, CurriedAnyFunction<never>>>(): T =>
  Object.create(null)
