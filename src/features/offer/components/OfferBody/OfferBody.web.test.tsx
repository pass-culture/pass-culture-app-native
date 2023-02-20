import mockdate from 'mockdate'
import React from 'react'

import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { act, cleanup, fireEvent, render, screen } from 'tests/utils/web'

jest.mock('react-query')
jest.mock('features/offer/api/useOffer')

const mockSubcategories = placeholderData.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

const offerId = 1

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })
  afterEach(cleanup)

  describe('share on social media', () => {
    it('should open web share modal on "Plus d’options" press', async () => {
      render(<OfferBody offerId={offerId} onScroll={jest.fn()} />)

      await act(async () => {
        const otherButton = screen.getByText('Plus d’options')
        fireEvent.click(otherButton)
      })

      expect(screen.queryByText('Partager l’offre')).toBeTruthy()
    })
  })
})
