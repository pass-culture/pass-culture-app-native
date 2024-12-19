import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { useDistance } from 'libs/location/hooks/useDistance'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { render, screen, fireEvent, waitFor } from 'tests/utils'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

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

describe('MarketingBlockExclusivity', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('navigate to offer when pressing', async () => {
    render(<MarketingBlockExclusivity {...props} />)

    const titlelink = screen.getByText('La nuit des temps')
    fireEvent.press(titlelink)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', { id: '102280' })
    })
  })

  it('should log consult offer when pressed', () => {
    render(<MarketingBlockExclusivity {...props} homeEntryId="fakeEntryId" />)

    const titlelink = screen.getByText('La nuit des temps')
    fireEvent.press(titlelink)

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      from: 'home',
      moduleId: '1',
      homeEntryId: 'fakeEntryId',
      moduleName: 'La nuit des temps',
      offerId: 102280,
    })
  })
})
