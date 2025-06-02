import { Appearance, ColorSchemeName } from 'react-native'

import { createStore } from 'libs/store/createStore'

export enum ColorScheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum ColorSchemeComputed {
  LIGHT = 'light',
  DARK = 'dark',
}

const colorSchemeStore = createStore({
  name: 'colorScheme',
  defaultState: {
    colorScheme: ColorSchemeComputed.LIGHT,
    colorSchemeByUser: ColorScheme.LIGHT,
    enableDarkMode: false,
  },
  actions: (set) => ({
    setColorScheme: ({ colorScheme }: { colorScheme: ColorScheme }) => {
      let toto: ColorSchemeComputed = ColorSchemeComputed.LIGHT

      switch (colorScheme) {
        case ColorScheme.SYSTEM:
          if (Appearance.getColorScheme() === 'dark') toto = ColorSchemeComputed.DARK
          break
        case ColorScheme.DARK:
          toto = ColorSchemeComputed.DARK
          break
        case ColorScheme.LIGHT:
          toto = ColorSchemeComputed.LIGHT
          break
      }
      set((state) =>
        state.enableDarkMode
          ? {
              colorScheme: toto,
              colorSchemeByUser: colorScheme,
            }
          : {
              colorScheme: ColorSchemeComputed.LIGHT,
              colorSchemeByUser: ColorScheme.LIGHT,
            }
      )
    },
    setColorSchemeAppearance: ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      colorSchemeStore.actions.setColorScheme({
        colorScheme: colorScheme
          ? colorScheme === 'light'
            ? ColorScheme.LIGHT
            : ColorScheme.DARK
          : ColorScheme.SYSTEM,
      })
    },
    setEnableDarkMode: (enableDarkMode: boolean) => {
      set({ enableDarkMode })
    },
  }),
  selectors: {
    selectColorScheme:
      () =>
      (state): ColorSchemeComputed =>
        state.colorScheme,
    selectColorSchemeByUser:
      () =>
      (state): ColorScheme =>
        state.colorSchemeByUser,
  },
  options: { persist: true },
})

export const colorSchemeActions = colorSchemeStore.actions
export const useStoredColorSchemeByUser: () => ColorScheme =
  colorSchemeStore.hooks.useColorSchemeByUser

export const useColorScheme: () => ColorSchemeComputed = colorSchemeStore.hooks.useColorScheme

Appearance.addChangeListener(colorSchemeStore.actions.setColorSchemeAppearance)
