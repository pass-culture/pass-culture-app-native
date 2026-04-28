import { createStore } from 'libs/store/createStore'

interface PhoneNumber {
  phoneNumber: string
  countryId: string
}

type State = { phoneNumber: PhoneNumber | null }

const defaultState: State = { phoneNumber: null }

const phoneNumberStore = createStore({
  name: 'profile-phone-number',
  defaultState,
  actions: (set) => ({
    setPhoneNumber: (phoneNumber: PhoneNumber) => set({ phoneNumber }),
    resetPhoneNumber: () => set(defaultState),
  }),
  selectors: {
    selectPhoneNumber: () => (state) => state.phoneNumber,
  },
  options: { persist: true },
})

export const phoneNumberActions = phoneNumberStore.actions
export const { usePhoneNumber } = phoneNumberStore.hooks
