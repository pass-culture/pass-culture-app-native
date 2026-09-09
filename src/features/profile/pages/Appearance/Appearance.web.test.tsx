import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { ColorScheme, colorSchemeActions } from 'libs/styled/useColorScheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen, userEvent, within } from 'tests/utils/web'

import { Appearance } from './Appearance'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.mock('react-native-orientation-locker', () => ({
  lockToPortrait: jest.fn(),
  unlockAllOrientations: jest.fn(),
  addOrientationListener: jest.fn(),
  removeOrientationListener: jest.fn(),
  addLockListener: jest.fn(),
  removeLockListener: jest.fn(),
}))

describe('Appearance', () => {
  beforeEach(() => {
    colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.LIGHT })
  })

  it('changes the theme with arrow keys and retains focus', async () => {
    const user = await userEvent.setup()
    const logTheme = jest.spyOn(analytics, 'logUpdateAppTheme')
    renderAppearance()
    const group = screen.getByRole('radiogroup', { name: 'Thème' })
    const light = within(group).getByRole('radio', { name: 'Mode clair - Affichage classique' })
    act(() => light.focus())

    await user.keyboard('[ArrowDown]')

    const dark = within(group).getByRole('radio', {
      name: 'Mode sombre - Réduit la fatigue visuelle',
    })

    expect(dark).toHaveFocus()
    expect(dark).toBeChecked()
    expect(logTheme).toHaveBeenCalledTimes(1)
    expect(logTheme).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: 'web',
        themeSetting: ColorScheme.DARK,
      })
    )

    await user.keyboard('[Space]')

    expect(logTheme).toHaveBeenCalledTimes(1)
  })

  it('should not have basic accessibility issues', async () => {
    const { container } = renderAppearance()
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })

  it('should not display orientation toggle', () => {
    renderAppearance()

    const rotationTitle = screen.queryByText('Permettre l’orientation')

    expect(rotationTitle).not.toBeInTheDocument()
  })
})

const renderAppearance = () => render(reactQueryProviderHOC(<Appearance />))
