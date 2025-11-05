import { InseeCountry } from 'features/bonification/inseeCountries'
import { Title } from 'features/bonification/pages/BonificationTitle'
import { createStore } from 'libs/store/createStore'

type State = {
  firstNames: string[] | null
  givenName: string | null
  commonName: string | null
  title: Title | null
  birthDate: Date | null
  birthCity: string | null
  birthCountry: InseeCountry | null
}

const defaultState: State = {
  firstNames: null,
  givenName: null,
  commonName: null,
  title: null,
  birthDate: null,
  birthCity: null,
  birthCountry: null,
}

const legalRepresentativeStore = createStore({
  name: 'legal-representative',
  defaultState,
  actions: (set) => ({
    setFirstNames: (firstNames: string[]) => set({ firstNames }),
    setGivenName: (givenName: string) => set({ givenName }),
    setCommonName: (commonName: string) => set({ commonName }),
    setTitle: (title: Title) => set({ title }),
    setBirthDate: (birthDate: Date) => set({ birthDate }),
    setBirthCity: (birthCity: string) => set({ birthCity }),
    setBirthCountry: (birthCountry: InseeCountry) => set({ birthCountry }),
    resetLegalRepresentative: () => set(defaultState),
  }),
  selectors: {
    selectLegalRepresentative: () => (state) => state,
  },
  options: { persist: true },
})

export const legalRepresentativeActions = legalRepresentativeStore.actions

export const { useLegalRepresentative } = legalRepresentativeStore.hooks
