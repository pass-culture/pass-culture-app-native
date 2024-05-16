import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

type State = {
  address: string | null
}
type Actions = {
  setAddress: (payload: string) => void
  resetAddress: () => void
}

type Store = State & { actions: Actions }

const useAddressStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        address: null,
        actions: {
          setAddress: (payload) => set({ address: payload }),
          resetAddress: () => set({ address: null }),
        },
      }),
      {
        name: 'profile-address',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ address: state.address }),
      }
    ),
    { enabled: process.env.NODE_ENV === 'development', name: 'profile-address' }
  )
)

export const useAddress = () => useAddressStore((state) => state.address)
export const useAddressActions = () => useAddressStore((state) => state.actions)
