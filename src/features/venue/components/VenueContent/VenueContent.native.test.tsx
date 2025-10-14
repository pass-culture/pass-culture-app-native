import mockdate from 'mockdate'
import React, { createRef } from 'react'
import { ScrollView } from 'react-native'

import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import * as useModalAPI from 'ui/components/modals/useModal'

const mockFFValue = false
jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag', () => ({
  useFeatureFlag: () => mockFFValue,
}))

jest.useFakeTimers()

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('features/gtlPlaylist/queries/useGTLPlaylistsQuery', () => ({
  useGTLPlaylistsQuery: () => ({ isLoading: false }),
}))
jest.mock('queries/venue/useVenueOffersQuery', () => ({
  useVenueOffersQuery: () => ({ isLoading: false }),
}))

jest.mock('libs/subcategories/useSubcategories')

jest.mock('libs/location/location')
jest.mock('features/search/context/SearchWrapper')
jest.mock('libs/firebase/analytics/analytics')

const BATCH_TRIGGER_DELAY_IN_MS = 5000

const mockShowModal = jest.fn()
jest.spyOn(useModalAPI, 'useModal').mockReturnValue({
  visible: false,
  showModal: mockShowModal,
  hideModal: jest.fn(),
  toggleModal: jest.fn(),
})

const renderVenueContent = (props?: Partial<React.ComponentProps<typeof VenueContent>>) => {
  return render(
    reactQueryProviderHOC(
      <AnchorProvider scrollViewRef={createRef<ScrollView>()} handleCheckScrollY={() => 0}>
        <OfferCTAProvider>
          <VenueContent venue={venueDataTest} showSearchInVenueModal={mockShowModal} {...props}>
            <React.Fragment />
          </VenueContent>
        </OfferCTAProvider>
      </AnchorProvider>
    )
  )
}

describe('<VenueContent />', () => {
  it('should not display "Rechercher une offre" button if there is no offer', async () => {
    renderVenueContent()
    await screen.findAllByText('Le Petit Rintintin 1')

    expect(screen.queryByText('Rechercher une offre')).not.toBeOnTheScreen()
  })

  describe('Batch trigger', () => {
    it('should trigger event after 5 seconds', async () => {
      renderVenueContent()

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event before 5 seconds have elapsed', async () => {
      renderVenueContent()

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 100)
      })

      expect(BatchProfile.trackEvent).not.toHaveBeenCalled()
    })
  })
})
