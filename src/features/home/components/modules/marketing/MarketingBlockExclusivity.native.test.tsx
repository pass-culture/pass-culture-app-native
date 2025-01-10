import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { useDistance } from 'libs/location/hooks/useDistance'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { render, screen, waitFor, userEvent } from 'tests/utils'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

const today = new Date('2025-02-16T03:24:00')
const tomorrow = new Date('2025-02-17T03:24:00')
const yesterday = new Date('2025-02-15T03:24:00')

const props = {
  moduleId: '1',
  offer: offersFixture[0],
}

jest.mock('libs/location/hooks/useDistance')
const mockUseDistance = useDistance as jest.Mock
mockUseDistance.mockReturnValue('10 km')

jest.mock('libs/subcategories/useSubcategory')
const mockSubcategories = PLACEHOLDER_DATA.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))
jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')
const user = userEvent.setup()

jest.useFakeTimers()
mockdate.set(new Date(today))

describe('MarketingBlockExclusivity', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('navigate to offer when pressing', async () => {
    render(<MarketingBlockExclusivity {...props} />)

    const titlelink = screen.getByText('La nuit des temps')
    user.press(titlelink)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', { id: '102280' })
    })
  })

  it('should log consult offer when pressed', async () => {
    render(<MarketingBlockExclusivity {...props} homeEntryId="fakeEntryId" />)

    const titlelink = screen.getByText('La nuit des temps')
    user.press(titlelink)

    await waitFor(() => {
      expect(analytics.logConsultOffer).toHaveBeenCalledWith({
        from: 'home',
        moduleId: '1',
        homeEntryId: 'fakeEntryId',
        moduleName: 'La nuit des temps',
        offerId: 102280,
      })
    })
  })

  describe('publicationDate is after today', () => {
    it('should display a text with date when shouldDisplayPublicationDate is true', async () => {
      render(
        <MarketingBlockExclusivity
          {...props}
          publicationDate={tomorrow}
          shouldDisplayPublicationDate
        />
      )
      await screen.findByText('La nuit des temps')

      expect(screen.getByText('Disponible le 17 février')).toBeOnTheScreen()
    })

    it('should display a generic text when shouldDisplayPublicationDate is false', async () => {
      render(
        <MarketingBlockExclusivity
          {...props}
          publicationDate={tomorrow}
          shouldDisplayPublicationDate={false}
        />
      )
      await screen.findByText('La nuit des temps')

      expect(screen.getByText('Bientôt disponible')).toBeOnTheScreen()
    })
  })

  describe('publicationDate is today', () => {
    it('should not display bottomBanner with comingSoon information', () => {
      render(<MarketingBlockExclusivity {...props} publicationDate={today} />)

      expect(screen.queryByTestId('bottom-banner')).not.toBeOnTheScreen()
    })
  })

  describe('publicationDate is yesterday', () => {
    it('should not display bottomBanner with comingSoon information', () => {
      render(<MarketingBlockExclusivity {...props} publicationDate={yesterday} />)

      expect(screen.queryByTestId('bottom-banner')).not.toBeOnTheScreen()
    })
  })
})
