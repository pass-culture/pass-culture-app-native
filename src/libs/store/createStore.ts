import AsyncStorage from '@react-native-async-storage/async-storage'
// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import {
  AnyFunction,
  CurriedAnyFunction,
  StoreConfig,
  Store,
  ReplaceSelectByUse,
} from './store.types'

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

  const selectorsWithState = Object.entries(selectors).reduce(
    (acc, [key, selector]) => ({
      ...acc,
      [key]: (...args: Parameters<typeof selector>) => {
        const state = store.getState()
        return selector(...args)(state)
      },
    }),
    {} as {
      [K in keyof Selectors]: (
        ...args: Parameters<Selectors[K]>
      ) => ReturnType<ReturnType<Selectors[K]>>
    }
  )

  const hooks = Object.entries(selectors).reduce(
    (acc, [key, selector]) => ({
      ...acc,
      [key.replace('select', 'use')]: (...args: Parameters<typeof selector>) =>
        store((state) => selector(...args)(state)),
    }),
    {} as {
      [K in keyof Selectors as ReplaceSelectByUse<string & K>]: (
        ...args: Parameters<Selectors[K]>
      ) => ReturnType<ReturnType<Selectors[K]>>
    }
  )

  return {
    useStore: store,
    actions,
    selectors: selectorsWithState,
    select,
    hooks,
  }
}

const createEmptyActions = <T extends Record<string, AnyFunction>>(): T => Object.create(null)
const createEmptySelectors = <T extends Record<string, CurriedAnyFunction<never>>>(): T =>
  Object.create(null)
