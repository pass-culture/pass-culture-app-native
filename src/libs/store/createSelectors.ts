import type { StoreApi, UseBoundStore } from 'zustand'

type Store<State> = UseBoundStore<StoreApi<State>>

export const createSelectors = <
  State,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't want to restrict the selector parameters
  Selectors extends Record<string, (...args: any[]) => (state: State) => unknown>,
>(
  store: Store<State>,
  selectors: Selectors
): Selectors => {
  return selectors
}
