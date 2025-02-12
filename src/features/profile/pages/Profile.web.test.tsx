import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { mockSettings } from 'tests/mockSettings'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'
import * as useVersion from 'ui/hooks/useVersion.web'

import { Profile } from './Profile'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/favorites/context/FavoritesWrapper')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')
mockSettings()

jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.10.5')

describe('<Profile/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderProfile()
      const results = await checkAccessibilityFor(container, {
        // TODO(PC-19659): Fix FilterSwitch accessibility errors
        rules: {
          'aria-toggle-field-name': { enabled: false },
          'duplicate-id-aria': { enabled: false },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  it('should not display app share banner', () => {
    renderProfile()

    expect(screen.queryByText('Partage le pass Culture')).not.toBeInTheDocument()
  })

  it('should render correctly on desktop', async () => {
    const { container } = render(reactQueryProviderHOC(<Profile />), {
      theme: { isDesktopViewport: true },
    })

    await screen.findByText('Centre d’aide')

    expect(container).toMatchSnapshot()
  })

  it('should render correctly on mobile browser', async () => {
    const { container } = render(reactQueryProviderHOC(<Profile />), {
      theme: { isDesktopViewport: false },
    })

    await screen.findByText('Centre d’aide')

    expect(container).toMatchSnapshot()
  })

  describe('if enableCreditV3 is true', () => {
    beforeEach(() => {
      mockSettings({ wipEnableCreditV3: true })
    })

    it('should see "17 ou 18"', async () => {
      render(reactQueryProviderHOC(<Profile />), {
        theme: { isDesktopViewport: true },
      })

      const text = await screen.findByText(
        'Identifie-toi pour découvrir des offres culturelles et bénéficier de ton crédit si tu as 17 ou 18 ans.'
      )

      expect(text).toBeTruthy()
    })
  })

  describe('if enableCreditV3 is false', () => {
    beforeEach(() => {
      mockSettings()
    })

    it('should see "15 et 18"', async () => {
      render(reactQueryProviderHOC(<Profile />), {
        theme: { isDesktopViewport: true },
      })

      const text = await screen.findByText(
        'Identifie-toi pour découvrir des offres culturelles et bénéficier de ton crédit si tu as entre 15 et 18 ans.'
      )

      expect(text).toBeTruthy()
    })
  })
})

const renderProfile = () => render(reactQueryProviderHOC(<Profile />))
