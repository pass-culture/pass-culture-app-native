import { StoreApi, UseBoundStore } from 'zustand'

type Store<State> = UseBoundStore<StoreApi<State>>

type Actions<State, ActionsType> = (set: Store<State>['setState']) => ActionsType

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't want to restrict the payload type
export const createActions = <State, ActionsType extends Record<string, (...args: any[]) => void>>(
  store: Store<State>,
  actions: Actions<State, ActionsType>
): ActionsType => {
  return actions(store.setState)
}
