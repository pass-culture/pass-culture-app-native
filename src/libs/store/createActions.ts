import type { StoreApi, UseBoundStore } from 'zustand'

type Store<State> = UseBoundStore<StoreApi<State>>

type Actions<State, ActionsType> = (
  set: Store<State>['setState'],
  get: Store<State>['getState']
) => ActionsType

export const createActions = <
  State,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't want to restrict the payload type
  ActionsType extends Record<string, (...args: any[]) => void>,
>(
  store: Store<State>,
  actions: Actions<State, ActionsType>
): Readonly<ActionsType> => {
  return actions(store.setState, store.getState)
}
