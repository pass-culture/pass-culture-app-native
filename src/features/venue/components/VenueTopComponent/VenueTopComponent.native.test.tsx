import Clipboard from '@react-native-clipboard/clipboard'
import mockdate from 'mockdate'
import React, { ComponentProps } from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { Activity, VenueResponse } from 'api/gen'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import * as openingHoursStatusModule from 'features/venue/components/OpeningHoursStatus/getOpeningHoursStatus'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native-map-link')

jest.mock('@react-native-clipboard/clipboard')
const venueOpenToPublic = { ...venueDataTest, isOpenToPublic: true }

const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')
const getOpeningHoursStatusSpy = jest.spyOn(openingHoursStatusModule, 'getOpeningHoursStatus')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueTopComponent />', () => {
  beforeEach(() => {
    setFeatureFlags()
    useLocationV2.setState(defaultLocationState)
    mockdate.reset()
  })

  afterEach(() => {
    mockdate.reset()
  })

  it('should display full venue address', async () => {
    renderVenueTopComponent({ venue: venueOpenToPublic })

    expect(await screen.findByText('1 boulevard Poissonnière, 75000 Paris')).toBeOnTheScreen()
  })

  it('should display venue type', async () => {
    const culturalCenterVenue: VenueResponse = {
      ...venueOpenToPublic,
      activity: Activity.CULTURAL_CENTRE,
    }
    renderVenueTopComponent({ venue: culturalCenterVenue })

    expect(await screen.findByText('Centre culturel')).toBeOnTheScreen()
  })

  it('should display distance between user and venue when geolocation is activated and venue open to public', async () => {
    const userLocation = { latitude: 30, longitude: 30.1 }
    locationActions.setGeolocPosition(userLocation)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    const locatedVenue: VenueResponse = {
      ...venueOpenToPublic,
      latitude: 30,
      longitude: 30,
    }

    renderVenueTopComponent({ venue: locatedVenue })

    expect(await screen.findByText('À 10 km')).toBeOnTheScreen()
  })

  it('should not display cultural domains when specified if venue is open to public', async () => {
    renderVenueTopComponent({
      venue: {
        ...venueOpenToPublic,
        culturalDomains: [
          { id: 1, name: 'Architecture' },
          { id: 2, name: 'Arts numériques' },
        ],
      },
    })

    expect(screen.queryByText('Architecture')).not.toBeOnTheScreen()
    expect(screen.queryByText('Arts numériques')).not.toBeOnTheScreen()
  })

  it('should not display distance between user and venue when geolocation is not activated', async () => {
    const locatedVenue: VenueResponse = {
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
    getOpeningHoursStatusSpy.mockReturnValueOnce({
      openingState: 'open-soon',
      openingLabel: 'Ouvre bientôt - 9h',
      nextChangeTime: undefined,
    })
    renderVenueTopComponent({ venue: venueOpenToPublic })

    expect(await screen.findByText('Ouvre bientôt - 9h')).toBeOnTheScreen()
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
      renderVenueTopComponent({ venue: { ...venueDataTest, isOpenToPublic: false } })

      expect(screen.queryByText('Ouvre bientôt - 9h')).not.toBeOnTheScreen()
    })

    it('should not display full venue address', async () => {
      render(<VenueTopComponent venue={{ ...venueDataTest, isOpenToPublic: false }} />)

      expect(screen.queryByText('1 boulevard Poissonnière, 75000 Paris')).not.toBeOnTheScreen()
    })

    it('should not display distance between user and venue when geolocation is activated', async () => {
      const userLocation = { latitude: 30, longitude: 30.1 }
      locationActions.setGeolocPosition(userLocation)
      locationActions.setLocationMode(LocationMode.AROUND_ME)
      const locatedVenue: VenueResponse = {
        ...venueDataTest,
        latitude: 30,
        longitude: 30,
        isOpenToPublic: false,
      }

      renderVenueTopComponent({ venue: locatedVenue })

      expect(screen.queryByText('À 10 km')).not.toBeOnTheScreen()
    })

    it('should display cultural domains when specified', async () => {
      renderVenueTopComponent({
        venue: {
          ...venueDataTest,
          isOpenToPublic: false,
          culturalDomains: [
            { id: 1, name: 'Architecture' },
            { id: 2, name: 'Arts numériques' },
          ],
        },
      })

      expect(await screen.findByText('Architecture')).toBeOnTheScreen()
      expect(screen.getByText('Arts numériques')).toBeOnTheScreen()
    })
  })

  it('should not display volunteer card when venue has not volunteering url', () => {
    renderVenueTopComponent({ venue: venueOpenToPublic })

    expect(
      screen.queryByText(`Deviens bénévole pour\n“${venueOpenToPublic.name}”`)
    ).not.toBeOnTheScreen()
  })

  it('should display volunteer card when venue has volunteering url', () => {
    renderVenueTopComponent({
      venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
    })

    expect(screen.getByText(`Deviens bénévole pour\n“${venueOpenToPublic.name}”`)).toBeOnTheScreen()
  })

  it('should display volunteer card with GCP volunteer illustration', () => {
    renderVenueTopComponent({
      venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
    })

    expect(screen.getByTestId('imageBusinessIllustration').props.source.uri).toContain(
      'benevolat.png'
    )
  })

  it('should display volunteer card illustration with positive02 background color', () => {
    renderVenueTopComponent({
      venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
    })

    expect(screen.getByTestId('imageBusiness')).toHaveStyle({
      backgroundColor: theme.designSystem.color.illustration.positive02,
    })
  })

  it('should redirect to voluteer page when venue has volunteering url and pressing volunteer card', async () => {
    renderVenueTopComponent({
      venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
    })

    await user.press(screen.getByText(`Deviens bénévole pour\n“${venueOpenToPublic.name}”`))

    expect(mockOpenUrl).toHaveBeenCalledWith(
      'url?utm_source=pass-culture&utm_medium=app&utm_campaign=orga_non_inscrite'
    )
  })

  it('should trigger ClickVolunteerCTA log when venue has volunteering url and pressing volunteer card', async () => {
    renderVenueTopComponent({
      venue: { ...venueOpenToPublic, volunteeringUrl: 'url' },
    })

    await user.press(screen.getByText(`Deviens bénévole pour\n“${venueOpenToPublic.name}”`))

    expect(analytics.logClickVolunteerCTA).toHaveBeenCalledWith({
      from: 'venue',
      venueId: venueOpenToPublic.id.toString(),
    })
  })
})

type RenderVenueTopComponent = ComponentProps<typeof VenueTopComponent>

const renderVenueTopComponent = ({ venue }: RenderVenueTopComponent) =>
  render(reactQueryProviderHOC(<VenueTopComponent venue={venue} />))
