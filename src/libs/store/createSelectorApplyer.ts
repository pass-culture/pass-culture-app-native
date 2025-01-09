import type { StoreApi, UseBoundStore } from 'zustand'

type StoreType<State> = UseBoundStore<StoreApi<State>>

export const createSelectorApplyer =
  <State>(store: StoreType<State>) =>
  <T>(selector: (state: State) => T): T => {
    const state = store.getState()
    return selector(state)
  }
