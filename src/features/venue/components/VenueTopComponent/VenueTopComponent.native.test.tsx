import Clipboard from '@react-native-clipboard/clipboard'
import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ILocationContext, useLocation } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/location')
const mockUseLocation = jest.mocked(useLocation)
jest.mock('@react-native-clipboard/clipboard')

const user = userEvent.setup()

jest.useFakeTimers()

describe('<VenueTopComponent />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display full venue address', async () => {
    render(<VenueTopComponent venue={venueDataTest} />)

    expect(await screen.findByText('1 boulevard Poissonnière, 75000 Paris')).toBeOnTheScreen()
  })

  it('should display venue type', async () => {
    const culturalCenterVenue: VenueResponse = {
      ...venueDataTest,
      venueTypeCode: VenueTypeCodeKey.CULTURAL_CENTRE,
    }

    render(reactQueryProviderHOC(<VenueTopComponent venue={culturalCenterVenue} />))

    expect(await screen.findByText('Centre culturel')).toBeOnTheScreen()
  })

  it('should display distance between user and venue when geolocation is activated', async () => {
    const userLocation = { latitude: 30, longitude: 30.1 }
    mockUseLocation.mockReturnValueOnce({
      userLocation,
      hasGeolocPosition: true,
    } as ILocationContext)
    const locatedVenue: VenueResponse = { ...venueDataTest, latitude: 30, longitude: 30 }

    render(reactQueryProviderHOC(<VenueTopComponent venue={locatedVenue} />))

    expect(await screen.findByText('À 10 km')).toBeOnTheScreen()
  })

  it('should not display distance between user and venue when geolocation is not activated', async () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
    } as ILocationContext)
    const locatedVenue: VenueResponse = { ...venueDataTest, latitude: 30, longitude: 30 }
    render(reactQueryProviderHOC(<VenueTopComponent venue={locatedVenue} />))

    expect(screen.queryByText('À 10 km')).not.toBeOnTheScreen()
  })

  it('should copy the whole address when pressing the copy button', async () => {
    render(reactQueryProviderHOC(<VenueTopComponent venue={venueDataTest} />))

    await user.press(screen.getByText('Copier l’adresse'))

    expect(Clipboard.setString).toHaveBeenCalledWith(
      'Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris'
    )
  })

  it('should log analytics when copying address', async () => {
    Clipboard.getString = jest
      .fn()
      .mockReturnValue('Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris')
    render(reactQueryProviderHOC(<VenueTopComponent venue={venueDataTest} />))

    await user.press(screen.getByText('Copier l’adresse'))

    expect(analytics.logCopyAddress).toHaveBeenCalledWith({
      venueId: venueDataTest.id,
      from: 'venue',
    })
  })

  it('should render dynamics opening hours when feature flag is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_DYNAMIC_OPENING_HOURS])
    mockdate.set(new Date('2024-05-31T08:31:00'))

    render(reactQueryProviderHOC(<VenueTopComponent venue={venueDataTest} />))

    expect(screen.getByText('Ouvre bientôt - 9h')).toBeOnTheScreen()
  })

  it('should NOT render dynamics opening hours when feature flag is disabled', async () => {
    render(reactQueryProviderHOC(<VenueTopComponent venue={venueDataTest} />))

    expect(screen.queryByText('Fermé')).not.toBeOnTheScreen()
  })

  it('should NOT render dynamics opening hours when venue doesn t have openingHours', async () => {
    const venue = {
      ...venueDataTest,
      openingHours: undefined,
    }

    render(reactQueryProviderHOC(<VenueTopComponent venue={venue} />))

    expect(screen.queryByText('Fermé')).not.toBeOnTheScreen()
  })

  it('should log analytics when pressing Voir l’itinéraire', async () => {
    render(reactQueryProviderHOC(<VenueTopComponent venue={venueDataTest} />))

    await user.press(screen.getByText('Voir l’itinéraire'))

    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({
      venueId: venueDataTest.id,
      from: 'venue',
    })
  })

  it('should navigate to venue preview carousel', async () => {
    render(
      reactQueryProviderHOC(
        <VenueTopComponent
          venue={{
            ...venueDataTest,
            bannerUrl: 'https://image.com',
            bannerMeta: { is_from_google: false, image_credit: 'François Boulo' },
          }}
        />
      )
    )

    await user.press(screen.getByTestId('venueImage'))

    expect(navigate).toHaveBeenCalledWith('VenuePreviewCarousel', {
      id: venueDataTest.id,
    })
  })
})
