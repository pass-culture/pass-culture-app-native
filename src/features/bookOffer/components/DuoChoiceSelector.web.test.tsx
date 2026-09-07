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
      <button aria-label="Continue" />
    </BookingContext.Provider>
  )
}

describe('DuoChoiceSelector keyboard navigation', () => {
  it('selects Solo and Duo with arrows', async () => {
    mockIsDuo = true
    const user = await userEvent.setup()
    render(reactQueryProviderHOC(<BookingChoices />))

    expect(screen.getByRole('radiogroup', { name: 'Nombre de places' })).toBeInTheDocument()

    await user.tab()

    expect(screen.getByRole('radio', { name: /^Solo/ })).toHaveFocus()

    await user.keyboard('[ArrowRight]')

    expect(screen.getByRole('radio', { name: /^Duo/ })).toHaveFocus()
    expect(screen.getByRole('radio', { name: /^Duo/ })).toBeChecked()

    await user.keyboard('[ArrowLeft]')

    expect(screen.getByRole('radio', { name: /^Solo/ })).toBeChecked()

    await user.tab()

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
  })

  it('keeps Solo selected when it is the only available choice', async () => {
    mockIsDuo = false
    const user = await userEvent.setup()
    render(reactQueryProviderHOC(<BookingChoices />))

    expect(screen.getAllByRole('radio')).toHaveLength(1)

    await user.tab()
    await user.keyboard('[Space][ArrowRight][Space]')

    expect(screen.getByRole('radio', { name: /^Solo/ })).toBeChecked()

    await user.tab()

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
  })
})
