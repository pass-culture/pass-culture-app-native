import React from 'react'
import { Platform } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import * as ReactNative from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ColorScheme, colorSchemeActions } from 'libs/styled/useColorScheme'
import { render, screen, userEvent, waitFor } from 'tests/utils'

import { Appearance } from './Appearance'

jest.mock('libs/firebase/analytics/analytics')

const useColorSchemeSpy = jest.spyOn(ReactNative, 'useColorScheme')
const logUpdateAppThemeSpy = jest.spyOn(analytics, 'logUpdateAppTheme')
const user = userEvent.setup()

describe('Appearance', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE])
    Platform.OS = 'ios'
    colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.SYSTEM })
  })

  afterEach(() => {
    jest.clearAllMocks()
    Platform.OS = 'ios'
  })

  it('should render correctly', () => {
    render(<Appearance />)

    expect(screen).toMatchSnapshot()
  })

  it('should display dark mode section when feature flag is enable', async () => {
    render(<Appearance />)

    await screen.findByText('Apparence')

    const subtitle = screen.getByText('Thème')
    await waitFor(() => {
      expect(subtitle).toBeOnTheScreen()
    })
  })

  it('should not display dark mode section when feature flag is disable', async () => {
    setFeatureFlags()
    render(<Appearance />)

    await screen.findByText('Apparence')

    const subtitle = screen.queryByText('Thème')
    await waitFor(() => {
      expect(subtitle).not.toBeOnTheScreen()
    })
  })

  it('should log theme update when user selects dark mode', async () => {
    useColorSchemeSpy.mockReturnValueOnce('dark')
    useColorSchemeSpy.mockReturnValueOnce('dark')
    colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.LIGHT })
    render(<Appearance />)

    await screen.findByText('Apparence')
    await user.press(
      screen.getByLabelText(
        'Thème - Liste - Élément 2 sur 3 - Mode sombre - Réduit la fatigue visuelle - non sélectionné'
      )
    )

    expect(logUpdateAppThemeSpy).toHaveBeenCalledWith({
      platform: 'ios',
      systemTheme: ColorScheme.DARK,
      themeSetting: ColorScheme.DARK,
    })
  })
})
