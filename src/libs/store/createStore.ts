import AsyncStorage from '@react-native-async-storage/async-storage'
// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import {
  AnyFunction,
  CurriedAnyFunction,
  StoreConfig,
  Store,
  HookSelectors,
  SelectorsWithState,
} from './store.types'

export function createStore<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
>({
  name,
  defaultState,
  actions: createActions,
  selectors = createTypedEmptyObject<Selectors>(),
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

  const selectorsWithState = Object.entries(selectors).reduce(
    (acc, [key, selector]) => ({
      ...acc,
      [key]: (...args: Parameters<typeof selector>) => {
        const state = store.getState()
        return selector(...args)(state)
      },
    }),
    createTypedEmptyObject<SelectorsWithState<State, Selectors>>()
  )

  const hooks = Object.entries(selectors).reduce(
    (acc, [key, selector]) => ({
      ...acc,
      [key.replace('select', 'use')]: (...args: Parameters<typeof selector>) =>
        store((state) => selector(...args)(state)),
    }),
    createTypedEmptyObject<HookSelectors<State, Selectors>>()
  )

  return {
    store,
    actions,
    selectors: selectorsWithState,
    hooks: { useStore: store, ...hooks },
  }
}

const createTypedEmptyObject = <T>(): T => {
  return Object.create(null)
}
