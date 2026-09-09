import React, { useReducer } from 'react'

import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { bookOfferReducer, initialBookingState } from 'features/bookOffer/context/reducer'
import { BookingContext } from 'features/bookOffer/pages/BookingContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils/web'

let mockIsDuo = true
jest.mock('queries/offer/useBookingOfferQuery', () => ({
  useBookingOfferQuery: () => ({ isDuo: mockIsDuo }),
}))
jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: () => ({ price: 500 }),
}))
jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: () => 5000,
}))

const BookingChoices = () => {
  const [bookingState, dispatch] = useReducer(bookOfferReducer, initialBookingState)
  return (
    <BookingContext.Provider value={{ bookingState, dispatch, dismissModal: jest.fn() }}>
      <DuoChoiceSelector />
      <output aria-label="Quantité réservée">{bookingState.quantity}</output>
    </BookingContext.Provider>
  )
}

describe('DuoChoiceSelector', () => {
  it('updates the booking quantity when choosing Duo and Solo with the keyboard', async () => {
    mockIsDuo = true
    const user = await userEvent.setup()
    render(reactQueryProviderHOC(<BookingChoices />))

    await user.tab()
    await user.keyboard('[ArrowRight]')

    expect(screen.getByRole('status', { name: 'Quantité réservée' })).toHaveTextContent('2')

    await user.keyboard('[ArrowLeft]')

    expect(screen.getByRole('status', { name: 'Quantité réservée' })).toHaveTextContent('1')
  })

  it('only offers Solo when the offer does not allow Duo', () => {
    mockIsDuo = false
    render(reactQueryProviderHOC(<BookingChoices />))

    expect(screen.getByRole('radio', { name: /^Solo/ })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /^Duo/ })).not.toBeInTheDocument()
  })
})
