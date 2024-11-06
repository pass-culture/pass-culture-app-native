import React from 'react'

import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'
import * as useVersion from 'ui/hooks/useVersion.web'

import { Profile } from './Profile'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/favorites/context/FavoritesWrapper')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.10.5')

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

describe('<Profile/>', () => {
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
})

const renderProfile = () => render(reactQueryProviderHOC(<Profile />))
