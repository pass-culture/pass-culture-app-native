import AsyncStorage from '@react-native-async-storage/async-storage'
// eslint-disable-next-line no-restricted-imports
import { create, StateCreator } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

type Options = {
  persist?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't want to restrict the payload type
export const createStore = <State, Actions extends Record<string, (payload: any) => void>>(
  name: string,
  defaultState: State,
  getActions: StateCreator<State & { actions: Actions }, [], [], Actions>,
  options?: Options
) =>
  create<State & { actions: Actions }>()(
    devtools(
      options?.persist
        ? persist(
            (setState, getState, store) => ({
              ...defaultState,
              actions: getActions(setState, getState, store),
            }),
            {
              name,
              storage: createJSONStorage(() => AsyncStorage),
              partialize: (state) => {
                const stateWithoutActions = { ...state, actions: undefined }
                delete stateWithoutActions.actions
                return stateWithoutActions
              },
            }
          )
        : (setState, getState, store) => ({
            ...defaultState,
            actions: getActions(setState, getState, store),
          }),
      { enabled: false, name }
    )
  )
