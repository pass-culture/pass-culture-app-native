import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { VenuesModule } from 'features/home/components/modules/venues/VenuesModule'
import { ModuleData } from 'features/home/types'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics/provider'
import { DisplayParametersFields } from 'libs/contentful/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const props = {
  moduleId: 'fakemoduleid',
  displayParameters: { title: 'Module title', minOffers: 1 } as DisplayParametersFields,
  venuesParameters: { title: 'Module title', hitsPerPage: 10, isGeolocated: false },
  search: [],
  homeEntryId: 'fakeEntryId',
  index: 1,
  data: {
    playlistItems: venuesSearchFixture.hits,
    nbPlaylistResults: venuesSearchFixture.hits.length,
    moduleId: 'fakemoduleid',
  },
}

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('VenuesModule component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    renderVenuesModule()

    expect(screen.getByTestId('offersModuleList')).toBeOnTheScreen()
  })

  it('should not render if data is undefined', () => {
    renderVenuesModule({ data: undefined })

    expect(screen.queryByTestId('offersModuleList')).toBeNull()
  })

  it('should not display new tag when wipEnableVolunteerNewTag FF deactivated and playlist has exclusively volunteering venues', () => {
    renderVenuesModule({
      displayParameters: { ...props.displayParameters, isExclusiveVolunteering: true },
    })

    expect(screen.queryByText('Nouveau')).not.toBeOnTheScreen()
  })

  describe('When playlist has exclusively volunteering venues', () => {
    describe('When wipEnableVolunteerFeedback FF activated', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_VOLUNTEER_FEEDBACK])
      })

      it('should display feedback', () => {
        renderVenuesModule({
          displayParameters: { ...props.displayParameters, isExclusiveVolunteering: true },
        })

        expect(screen.getByText('Le bénévolat sur le pass t’intéresse t-il ?')).toBeOnTheScreen()
      })

      it('should trigger FeatureFeedbackClicked log with yes answer when answering yes to feedback quiz', async () => {
        await AsyncStorage.removeItem('volunteering_feedback')
        renderVenuesModule({
          displayParameters: { ...props.displayParameters, isExclusiveVolunteering: true },
        })

        await user.press(screen.getByText('Oui'))

        expect(analytics.logFeatureFeedbackClicked).toHaveBeenCalledWith({
          featureName: 'volunteer',
          feedbackResponse: 'Oui',
          from: 'home',
          entryId: 'fakeEntryId',
        })
      })

      it('should trigger FeatureFeedbackClicked log with no answer when answering no to feedback quiz', async () => {
        await AsyncStorage.removeItem('volunteering_feedback')
        renderVenuesModule({
          displayParameters: { ...props.displayParameters, isExclusiveVolunteering: true },
        })

        await user.press(screen.getByText('Non'))

        expect(analytics.logFeatureFeedbackClicked).toHaveBeenCalledWith({
          featureName: 'volunteer',
          feedbackResponse: 'Non',
          from: 'home',
          entryId: 'fakeEntryId',
        })
      })
    })

    it('should not display feedback when wipEnableVolunteerFeedback FF deactivated', () => {
      renderVenuesModule({
        displayParameters: { ...props.displayParameters, isExclusiveVolunteering: true },
      })

      expect(
        screen.queryByText('Le bénévolat sur le pass t’intéresse t-il ?')
      ).not.toBeOnTheScreen()
    })

    it('should trigger ConsultVenue log with originDetails set to volunteeringPlaylist when pressing on a venue', async () => {
      renderVenuesModule({
        displayParameters: { ...props.displayParameters, isExclusiveVolunteering: true },
      })

      const venues = screen.getAllByLabelText('Le Petit Rintintin 1 - Paris - 75000 - Cinéma')
      const firstVenue = venues[0]

      if (firstVenue) {
        await user.press(firstVenue)
      }

      expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
        venueId: props.data?.playlistItems[0].id.toString(),
        from: 'home',
        moduleName: props.displayParameters.title,
        moduleId: props.moduleId,
        homeEntryId: props.homeEntryId,
        originDetails: 'volunteeringPlaylist',
        displayAdvice: false,
      })
    })
  })

  describe('When playlist has not exclusively volunteering venues', () => {
    it('should not display new tag', () => {
      renderVenuesModule()

      expect(screen.queryByText('Nouveau')).not.toBeOnTheScreen()
    })

    it('should not display feedback when wipEnableVolunteerFeedback FF activated', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_VOLUNTEER_FEEDBACK])
      renderVenuesModule()

      expect(
        screen.queryByText('Le bénévolat sur le pass t’intéresse t-il ?')
      ).not.toBeOnTheScreen()
    })

    it('should trigger ConsultVenue log without originDetails set to volunteeringPlaylist when pressing on a venue', async () => {
      renderVenuesModule()
      const venues = screen.getAllByLabelText('Le Petit Rintintin 1 - Paris - 75000 - Cinéma')
      const firstVenue = venues[0]

      if (firstVenue) {
        await user.press(firstVenue)
      }

      expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
        venueId: props.data?.playlistItems[0].id.toString(),
        from: 'home',
        moduleName: props.displayParameters.title,
        moduleId: props.moduleId,
        homeEntryId: props.homeEntryId,
        displayAdvice: false,
      })
    })
  })
})

const renderVenuesModule = (
  additionalProps: { data?: ModuleData; displayParameters?: DisplayParametersFields } = {}
) => render(reactQueryProviderHOC(<VenuesModule {...props} {...additionalProps} />))
