import Clipboard from '@react-native-clipboard/clipboard'
import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { Activity, VenueResponse } from 'api/gen'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { ILocationContext, useLocation } from 'libs/location/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/location/location')
jest.mock('react-native-map-link')

const mockUseLocation = jest.mocked(useLocation)
jest.mock('@react-native-clipboard/clipboard')
const venueOpenToPublic = { ...venueDataTest, isOpenToPublic: true }

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueTopComponent />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display full venue address', async () => {
    renderVenueTopComponent(venueOpenToPublic)

    expect(await screen.findByText('1 boulevard Poissonnière, 75000 Paris')).toBeOnTheScreen()
  })

  it('should display venue type', async () => {
    const culturalCenterVenue: Omit<VenueResponse, 'isVirtual'> = {
      ...venueOpenToPublic,
      activity: Activity.CULTURAL_CENTRE,
    }
    renderVenueTopComponent(culturalCenterVenue)

    expect(await screen.findByText('Centre culturel')).toBeOnTheScreen()
  })

  it('should display distance between user and venue when geolocation is activated', async () => {
    const userLocation = { latitude: 30, longitude: 30.1 }
    mockUseLocation.mockReturnValueOnce({
      userLocation,
      hasGeolocPosition: true,
    } as ILocationContext)
    const locatedVenue: Omit<VenueResponse, 'isVirtual'> = {
      ...venueOpenToPublic,
      latitude: 30,
      longitude: 30,
    }

    renderVenueTopComponent(locatedVenue)

    expect(await screen.findByText('À 10 km')).toBeOnTheScreen()
  })

  it('should not display distance between user and venue when geolocation is not activated', async () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
    } as ILocationContext)
    const locatedVenue: Omit<VenueResponse, 'isVirtual'> = {
      ...venueOpenToPublic,
      latitude: 30,
      longitude: 30,
    }
    renderVenueTopComponent(locatedVenue)

    expect(screen.queryByText('À 10 km')).not.toBeOnTheScreen()
  })

  it('should copy the whole address when pressing the copy button', async () => {
    renderVenueTopComponent(venueOpenToPublic)
    await user.press(screen.getByText('Copier l’adresse'))

    expect(Clipboard.setString).toHaveBeenCalledWith(
      'Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris'
    )
  })

  it('should log analytics when copying address', async () => {
    Clipboard.getString = jest
      .fn()
      .mockReturnValue('Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris')
    renderVenueTopComponent(venueOpenToPublic)
    await user.press(screen.getByText('Copier l’adresse'))

    expect(analytics.logCopyAddress).toHaveBeenCalledWith({
      venueId: venueOpenToPublic.id,
      from: 'venue',
    })
  })

  it('should render dynamics opening hours', async () => {
    mockdate.set(new Date('2024-05-31T08:31:00'))
    renderVenueTopComponent(venueOpenToPublic)

    expect(screen.getByText('Ouvre bientôt - 9h')).toBeOnTheScreen()
  })

  it('should NOT render dynamics opening hours when venue doesn t have openingHours', async () => {
    renderVenueTopComponent({ ...venueOpenToPublic, openingHours: undefined })

    expect(screen.queryByText('Fermé')).not.toBeOnTheScreen()
  })

  it('should log analytics when pressing Voir l’itinéraire', async () => {
    render(reactQueryProviderHOC(<VenueTopComponent venue={venueOpenToPublic} />))

    await user.press(screen.getByText('Voir l’itinéraire'))

    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({
      venueId: venueOpenToPublic.id,
      from: 'venue',
    })
  })

  it('should navigate to venue preview carousel', async () => {
    renderVenueTopComponent({
      ...venueOpenToPublic,
      bannerUrl: 'https://image.com',
      bannerMeta: { is_from_google: false, image_credit: 'François Boulo' },
    })

    await user.press(
      screen.getByLabelText('Voir l’illustration en plein écran - © François Boulo')
    )

    expect(navigate).toHaveBeenCalledWith('VenuePreviewCarousel', {
      id: venueOpenToPublic.id,
    })
  })

  describe('venue is not open to public', () => {
    it('should not render dynamics opening hours', async () => {
      mockdate.set(new Date('2024-05-31T08:31:00'))

      renderVenueTopComponent({ ...venueDataTest, isOpenToPublic: false })

      expect(screen.queryByText('Ouvre bientôt - 9h')).not.toBeOnTheScreen()
    })

    it('should not display full venue address', async () => {
      render(<VenueTopComponent venue={{ ...venueDataTest, isOpenToPublic: false }} />)

      expect(screen.queryByText('1 boulevard Poissonnière, 75000 Paris')).not.toBeOnTheScreen()
    })
  })
})

const renderVenueTopComponent = (venue: Omit<VenueResponse, 'isVirtual'>) =>
  render(reactQueryProviderHOC(<VenueTopComponent venue={venue} />))
