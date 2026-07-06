import React from 'react'

import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { defaultLocationState, useLocationV2 } from 'libs/locationV2/location.store'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('@react-native-clipboard/clipboard')

describe('<VenueTopComponent />', () => {
  beforeEach(() => {
    setFeatureFlags()
    useLocationV2.setState(defaultLocationState)
  })

  it('should display preview in modal', async () => {
    render(
      reactQueryProviderHOC(
        <VenueTopComponent
          venue={{
            ...venueDataTest,
            bannerUrl: 'https://image.com',
            bannerIsFromGoogle: false,
            bannerCredit: 'François Boulo',
          }}
        />
      ),
      { theme: { isDesktopViewport: true } }
    )

    fireEvent.click(screen.getByLabelText('Voir l’illustration en plein écran - © François Boulo'))

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
            bannerIsFromGoogle: false,
            bannerCredit: 'François Boulo',
          }}
        />
      ),
      { theme: { isDesktopViewport: false } }
    )

    fireEvent.click(screen.getByLabelText('Voir l’illustration en plein écran - © François Boulo'))

    expect(screen.queryByTestId('fullscreenModalView')).not.toBeInTheDocument()
  })
})
