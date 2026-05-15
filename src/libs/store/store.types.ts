import { StoreApi, UseBoundStore } from 'zustand'

export type AnyFunction = (...args: never[]) => unknown

export type CurriedAnyFunction<State> = (...args: never[]) => (state: State) => unknown
type Options = {
  persist?: boolean
}
type ReplaceSelectByUse<T extends string> = T extends `select${infer U}` ? `use${U}` : never
type StoreType<State> = UseBoundStore<StoreApi<State>>

export type StoreConfig<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<`select${string}`, CurriedAnyFunction<State>>,
> = {
  name: string
  defaultState: State
  actions: (setState: StoreType<State>['setState']) => Actions
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

export type HookSelectors<State, Selectors extends Record<string, CurriedAnyFunction<State>>> = {
  [K in keyof Selectors as ReplaceSelectByUse<string & K>]: (
    ...args: Parameters<Selectors[K]>
  ) => ReturnType<ReturnType<Selectors[K]>>
}

export type Store<
  State,
  Actions extends Record<string, AnyFunction>,
  Selectors extends Record<string, CurriedAnyFunction<State>>,
> = {
  store: StoreType<State>
  actions: Actions
  selectors: SelectorsWithState<State, Selectors>
  hooks: { useStore: StoreType<State> } & HookSelectors<State, Selectors>
}
