import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum } from 'api/gen'
import { analytics } from 'libs/analytics'
import { useDistance } from 'libs/location/hooks/useDistance'
import { render, screen, fireEvent, waitFor } from 'tests/utils'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

const props = {
  moduleId: '1',
  title: 'Harry Potter et l’Ordre du Phénix',
  categoryId: CategoryIdEnum.FILM,
  offerId: 123,
  backgroundImageUrl: 'url',
  offerImageUrl: 'url',
  offerLocation: { lat: 1, lng: 1 },
  price: '10€',
  categoryText: 'Cinéma',
}

jest.mock('libs/location/hooks/useDistance')
const mockUseDistance = useDistance as jest.Mock
mockUseDistance.mockReturnValue('10 km')

describe('MarketingBlockExclusivity', () => {
  it('should display correct accessibility label', () => {
    render(<MarketingBlockExclusivity {...props} />)

    const accessibilityLabel = screen.getByLabelText(
      'Découvre l’offre exclusive "Harry Potter et l’Ordre du Phénix" de la catégorie "Cinéma" au prix de 10€. L’offre se trouve à 10 km'
    )

    expect(accessibilityLabel).toBeTruthy()
  })

  it('navigate to offer when pressing', async () => {
    render(<MarketingBlockExclusivity {...props} />)

    const titlelink = screen.getByText('Harry Potter et l’Ordre du Phénix')
    fireEvent.press(titlelink)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', { id: 123 })
    })
  })

  it('should log consult offer when pressed', () => {
    render(<MarketingBlockExclusivity {...props} homeEntryId="fakeEntryId" />)

    const titlelink = screen.getByText('Harry Potter et l’Ordre du Phénix')
    fireEvent.press(titlelink)

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      from: 'home',
      moduleId: '1',
      homeEntryId: 'fakeEntryId',
      moduleName: 'Harry Potter et l’Ordre du Phénix',
      offerId: 123,
    })
  })
})
