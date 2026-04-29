import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'
import * as useVersion from 'ui/hooks/useVersion.web'

import { ProfileV1 } from './ProfileV1'

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

jest.mock('features/favorites/context/FavoritesWrapper')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.10.5')

describe('<ProfileV1 />', () => {
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
    const mockDeviceInfo = {
      deviceId: 'desktop-device-id',
      os: 'Windows 11',
      source: 'Chrome / Windows',
      resolution: '1920x1080',
      fontScale: 1,
      screenZoomLevel: 1,
    }
    jest.mock('features/trustedDevice/helpers/useDeviceInfo', () => ({
      useDeviceInfo: () => mockDeviceInfo,
    }))

    const { container } = render(reactQueryProviderHOC(<ProfileV1 />), {
      theme: { isDesktopViewport: true },
    })

    await screen.findByText('Chercher une info')

    expect(container).toMatchSnapshot()
  })

  it('should render correctly on mobile browser', async () => {
    const mockDeviceInfo = {
      deviceId: 'mobile-device-id',
      os: 'iOS 17',
      source: 'iPhone 15',
      resolution: '1170x2532',
      fontScale: 1,
      screenZoomLevel: 1.25,
    }
    jest.mock('features/trustedDevice/helpers/useDeviceInfo', () => ({
      useDeviceInfo: () => mockDeviceInfo,
    }))

    const { container } = render(reactQueryProviderHOC(<ProfileV1 />), {
      theme: { isDesktopViewport: false },
    })

    await screen.findByText('Chercher une info')

    expect(container).toMatchSnapshot()
  })
})

const renderProfile = () => render(reactQueryProviderHOC(<ProfileV1 />))
