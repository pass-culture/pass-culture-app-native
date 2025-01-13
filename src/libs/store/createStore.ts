import { StoreApi, UseBoundStore } from 'zustand'

import { createConfiguredStore } from './createConfiguredStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CurriedAnyFunction<State> = (...args: any[]) => (state: State) => any

type Options = {
  persist?: boolean
}

type StoreConfig<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
> = {
  name: string
  defaultState: State
  actions?: (
    setState: (
      partial: Partial<State> | ((state: State) => Partial<State>),
      replace?: boolean
    ) => void
  ) => Actions
  selectors?: Selectors
  options?: Options
}

type Store<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
> = {
  useStore: UseBoundStore<StoreApi<State>>
  actions: Actions
  selectors: Selectors
  select: <T>(selector: (state: State) => T) => T
}

export function createStore<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
>({
  name,
  defaultState,
  actions: createActions,
  selectors = {} as Selectors,
  options,
}: StoreConfig<State, Actions, Selectors>): Store<State, Actions, Selectors> {
  const store = createConfiguredStore({
    name: name,
    defaultState: defaultState,
    options,
  })

  const actions = createActions?.(store.setState) || ({} as Actions)

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
