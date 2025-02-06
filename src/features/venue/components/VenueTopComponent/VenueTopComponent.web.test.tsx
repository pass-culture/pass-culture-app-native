import React from 'react'

import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { useLocation } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/location')
jest.mocked(useLocation)
jest.mock('@react-native-clipboard/clipboard')

describe('<VenueTopComponent />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display preview in modal', async () => {
    render(
      reactQueryProviderHOC(
        <VenueTopComponent
          venue={{
            ...venueDataTest,
            bannerUrl: 'https://image.com',
            bannerMeta: { is_from_google: false, image_credit: 'François Boulo' },
          }}
        />
      ),
      { theme: { isDesktopViewport: true } }
    )

    fireEvent.click(screen.getByTestId('venueImage'))

    expect(await screen.findByTestId('fullscreenModalView')).toBeInTheDocument()
    expect(screen.getByLabelText('Image 1')).toBeInTheDocument()
  })

  it('should not display preview in modal if breakpoint is not desktop', async () => {
    render(
      reactQueryProviderHOC(
        <VenueTopComponent
          venue={{
            ...venueDataTest,
            bannerUrl: 'https://image.com',
            bannerMeta: { is_from_google: false, image_credit: 'François Boulo' },
          }}
        />
      ),
      { theme: { isDesktopViewport: false } }
    )

    fireEvent.click(screen.getByTestId('venueImage'))

    expect(screen.queryByTestId('fullscreenModalView')).not.toBeInTheDocument()
  })
})
