import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, screen } from 'tests/utils/web'
import * as useVersion from 'ui/hooks/useVersion.web'

import { Profile } from './Profile'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/favorites/context/FavoritesWrapper')

jest.mock('libs/firebase/analytics/analytics')

jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.10.5')

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
