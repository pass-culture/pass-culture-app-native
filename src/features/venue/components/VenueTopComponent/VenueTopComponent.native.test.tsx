import Clipboard from '@react-native-clipboard/clipboard'
import mockdate from 'mockdate'
import React, { ComponentProps } from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { Activity, VenueResponse } from 'api/gen'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
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

const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueTopComponent />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display full venue address', async () => {
    renderVenueTopComponent({ venue: venueOpenToPublic })

    expect(await screen.findByText('1 boulevard Poissonnière, 75000 Paris')).toBeOnTheScreen()
  })

  it('should display venue type', async () => {
    const culturalCenterVenue: Omit<VenueResponse, 'isVirtual'> = {
      ...venueOpenToPublic,
      activity: Activity.CULTURAL_CENTRE,
    }
    renderVenueTopComponent({ venue: culturalCenterVenue })

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

    renderVenueTopComponent({ venue: locatedVenue })

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
    renderVenueTopComponent({ venue: locatedVenue })

    expect(screen.queryByText('À 10 km')).not.toBeOnTheScreen()
  })

  it('should copy the whole address when pressing the copy button', async () => {
    renderVenueTopComponent({ venue: venueOpenToPublic })
    await user.press(screen.getByText('Copier l’adresse'))

    expect(Clipboard.setString).toHaveBeenCalledWith(
      'Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris'
    )
  })

  it('should log analytics when copying address', async () => {
    Clipboard.getString = jest
      .fn()
      .mockReturnValue('Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris')
    renderVenueTopComponent({ venue: venueOpenToPublic })
    await user.press(screen.getByText('Copier l’adresse'))

    expect(analytics.logCopyAddress).toHaveBeenCalledWith({
      venueId: venueOpenToPublic.id,
      from: 'venue',
    })
  })

  it('should render dynamics opening hours', async () => {
    mockdate.set(new Date('2024-05-31T08:31:00'))
    renderVenueTopComponent({ venue: venueOpenToPublic })

    expect(screen.getByText('Ouvre bientôt - 9h')).toBeOnTheScreen()
  })

  it('should NOT render dynamics opening hours when venue doesn t have openingHours', async () => {
    renderVenueTopComponent({ venue: { ...venueOpenToPublic, openingHours: undefined } })

    expect(screen.queryByText('Fermé')).not.toBeOnTheScreen()
  })

  it('should log analytics when pressing Voir l’itinéraire', async () => {
    renderVenueTopComponent({ venue: venueOpenToPublic })

    await user.press(screen.getByText('Voir l’itinéraire'))

    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({
      venueId: venueOpenToPublic.id,
      from: 'venue',
    })
  })

  it('should navigate to venue preview carousel', async () => {
    renderVenueTopComponent({
      venue: {
        ...venueOpenToPublic,
        bannerUrl: 'https://image.com',
        bannerIsFromGoogle: false,
        bannerCredit: 'François Boulo',
      },
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

      renderVenueTopComponent({ venue: { ...venueDataTest, isOpenToPublic: false } })

      expect(screen.queryByText('Ouvre bientôt - 9h')).not.toBeOnTheScreen()
    })

    it('should not display full venue address', async () => {
      render(<VenueTopComponent venue={{ ...venueDataTest, isOpenToPublic: false }} />)

      expect(screen.queryByText('1 boulevard Poissonnière, 75000 Paris')).not.toBeOnTheScreen()
    })
  })

  it('should not display volunteer card when wipEnableVolunteer FF deactivated and venue has volunteering url', () => {
    renderVenueTopComponent({ venue: { ...venueOpenToPublic, volunteeringUrl: 'url' } })

    expect(
      screen.queryByText(`Deviens bénévole pour\n“${venueOpenToPublic.name}”`)
    ).not.toBeOnTheScreen()
  })

  describe('When wipEnableVolunteer FF activated', () => {
    it('should not display volunteer card when venue has not volunteering url', () => {
      renderVenueTopComponent({ venue: venueOpenToPublic, enableVolunteer: true })

      expect(
        screen.queryByText(`Deviens bénévole pour\n“${venueOpenToPublic.name}”`)
      ).not.toBeOnTheScreen()
    })

    it('should display volunteer card when venue has volunteering url', () => {
      renderVenueTopComponent({
        venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
        enableVolunteer: true,
      })

      expect(
        screen.getByText(`Deviens bénévole pour\n“${venueOpenToPublic.name}”`)
      ).toBeOnTheScreen()
    })

    it('should redirect to voluteer page when venue has volunteering url and pressing voluteer card', async () => {
      renderVenueTopComponent({
        venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
        enableVolunteer: true,
      })

      await user.press(screen.getByText(`Deviens bénévole pour\n“${venueOpenToPublic.name}”`))

      expect(mockOpenUrl).toHaveBeenCalledWith('url')
    })

    it('should display new tag on volunteer card when venue has volunteering url and wipEnableVolunteerNewTag FF activated', () => {
      renderVenueTopComponent({
        venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
        enableVolunteer: true,
        enableVolunteerNewTag: true,
      })

      expect(screen.getByText('Nouveau')).toBeOnTheScreen()
    })

    it('should not display new tag on volunteer card when venue has volunteering url and wipEnableVolunteerNewTag FF deactivated', () => {
      renderVenueTopComponent({
        venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
        enableVolunteer: true,
      })

      expect(screen.queryByText('Nouveau')).not.toBeOnTheScreen()
    })
  })
})

type RenderVenueTopComponent = ComponentProps<typeof VenueTopComponent>

const renderVenueTopComponent = ({
  venue,
  enableVolunteer,
  enableVolunteerNewTag,
}: RenderVenueTopComponent) =>
  render(
    reactQueryProviderHOC(
      <VenueTopComponent
        venue={venue}
        enableVolunteer={enableVolunteer}
        enableVolunteerNewTag={enableVolunteerNewTag}
      />
    )
  )
