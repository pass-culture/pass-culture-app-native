import mockdate from 'mockdate'
import React from 'react'
import { Linking } from 'react-native'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { act, cleanup, fireEvent, render, screen } from 'tests/utils/web'

jest.mock('react-query')
jest.mock('features/offer/api/useOffer')

const mockSubcategories = placeholderData.subcategories
const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      searchGroups: mockSearchGroups,
    },
  }),
}))

const openURLSpy = jest.spyOn(Linking, 'openURL')

const offerId = 1

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })
  afterEach(cleanup)

  describe('share on social media', () => {
    it('should open url to share on social medium', async () => {
      render(<OfferBody offerId={offerId} onScroll={jest.fn()} />)

      await act(async () => {
        const whatsappButton = await screen.findByText('Envoyer sur WhatsApp')
        fireEvent.click(whatsappButton)
      })

      const offerUrl = getOfferUrl(offerId)
      const expectedMessage = `Retrouve "${mockOffer.name}" chez "${mockOffer.venue.name}" sur le pass Culture\n${offerUrl}`
      expect(openURLSpy).toHaveBeenNthCalledWith(
        1,
        `https://api.whatsapp.com/send?text=${encodeURIComponent(expectedMessage)}`
      )
    })

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
