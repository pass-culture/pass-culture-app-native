import { ColorSchemeName, Appearance } from 'react-native'

import { createStore } from 'libs/store/createStore'

export type ColorScheme = 'dark' | 'light' | 'system'

type State = { colorScheme: ColorScheme }

const DEFAULT_COLOR_SCHEME = 'light'

const defaultState: State = {
  colorScheme: DEFAULT_COLOR_SCHEME,
}

const colorSchemeStore = createStore({
  name: 'colorScheme',
  defaultState,
  actions: (set) => ({
    init: () => set({ colorScheme: Appearance.getColorScheme() || DEFAULT_COLOR_SCHEME }),
    setColorScheme: ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      set({ colorScheme: colorScheme || DEFAULT_COLOR_SCHEME })
    },
  }),
  selectors: {
    selectColorScheme:
      () =>
      (state): ColorScheme =>
        state.colorScheme,
  },
  options: { persist: true },
})

export const colorSchemeActions = colorSchemeStore.actions
export const { useColorScheme } = colorSchemeStore.hooks

Appearance.addChangeListener(colorSchemeStore.actions.setColorScheme)
