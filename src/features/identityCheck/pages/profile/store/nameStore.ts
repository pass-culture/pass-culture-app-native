import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface Name {
  firstName: string
  lastName: string
}

type State = { name: Name | null }

type Actions = {
  setName: (payload: Name) => void
  resetName: () => void
}

type Store = State & { actions: Actions }

const useNameStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        name: null,
        actions: {
          setName: (payload) => set({ name: payload }),
          resetName: () => set({ name: null }),
        },
      }),
      {
        name: 'profile-name',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ name: state.name }),
      }
    ),
    { enabled: process.env.NODE_ENV === 'development', name: 'profile-name' }
  )
)

export const useName = () => useNameStore((state) => state.name)
export const useNameActions = () => useNameStore((state) => state.actions)
