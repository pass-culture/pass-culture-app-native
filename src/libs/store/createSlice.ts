import { StoreApi, UseBoundStore } from 'zustand'

import { createActions } from './createActions'
import { createSelectorApplyer } from './createSelectorApplyer'
import { createSelectors } from './createSelectors'
import { createStore } from './createStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CurriedAnyFunction<TState> = (...args: any[]) => (state: TState) => any

type SliceConfig<
  TState,
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, CurriedAnyFunction<TState>>,
  THandlers extends Record<string, AnyFunction>,
> = {
  name: string
  defaultState: TState
  actions: (
    setState: (
      partial: Partial<TState> | ((state: TState) => Partial<TState>),
      replace?: boolean
    ) => void
  ) => TActions
  selectors: TSelectors
  handlers?: THandlers
}

type Slice<
  TState,
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, CurriedAnyFunction<TState>>,
  THandlers extends Record<string, AnyFunction>,
> = {
  useStore: UseBoundStore<StoreApi<TState>>
  actions: TActions
  selectors: TSelectors
  applySelector: <T>(selector: (state: TState) => T) => T
  handlers: THandlers
}

export function createSlice<
  TState,
  TActions extends Record<string, AnyFunction>,
  TSelectors extends Record<string, CurriedAnyFunction<TState>>,
  THandlers extends Record<string, AnyFunction>,
>(
  config: SliceConfig<TState, TActions, TSelectors, THandlers>
): Slice<TState, TActions & { reset: VoidFunction }, TSelectors, THandlers> {
  const useStore = createStore({
    name: config.name,
    defaultState: config.defaultState,
  })

  const actions = { ...createActions(useStore, config.actions), reset: () => config.defaultState }
  const selectors = createSelectors(useStore, config.selectors)
  const applySelector = createSelectorApplyer(useStore)

  return {
    useStore,
    actions,
    selectors,
    applySelector,
    handlers: config.handlers || ({} as THandlers),
  }
}
