import { StoreApi, UseBoundStore } from 'zustand'

export type AnyFunction = (...args: never[]) => unknown
export type CurriedAnyFunction<State> = (...args: never[]) => (state: State) => unknown
type Options = {
  persist?: boolean
}
type StoreType<State> = UseBoundStore<StoreApi<State>>
export type StoreConfig<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
> = {
  name: string
  defaultState: State
  actions?: (setState: StoreType<State>['setState']) => Actions
  selectors?: Selectors
  options?: Options
}
export type SelectorsWithState<
  State,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
> = {
  [K in keyof Selectors]: (
    ...args: Parameters<Selectors[K]>
  ) => ReturnType<ReturnType<Selectors[K]>>
}
export type Store<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
> = {
  useStore: UseBoundStore<StoreApi<State>>
  actions: Actions
  selectors: SelectorsWithState<State, Selectors>
  select: <T>(selector: (state: State) => T) => T
}
