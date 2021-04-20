/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks'
import { Platform } from 'react-native'

import { CategoryType, OfferResponse } from 'api/gen'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { Step } from 'features/bookOffer/pages/reducer'
import { notExpiredStock as baseStock } from 'features/offer/services/useCtaWordingAndAction.testsFixtures'

import { useModalContent } from '../useModalContent'

let mockOffer: OfferResponse | undefined = baseOffer

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()
let mockStep = Step.DATE

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({
    dispatch: mockDispatch,
    bookingState: { quantity: 1, step: mockStep },
    dismissModal: mockDismissModal,
  })),
  useBookingOffer: jest.fn(() => mockOffer),
}))

describe('useModalContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('show default modal if no information yet', () => {
    mockOffer = undefined

    const { result } = renderHook(useModalContent)

    expect(result.current.children).toMatchInlineSnapshot('<React.Fragment />')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('')
  })

  it('iOS - shows BookingImpossible if the digital offer is not free', () => {
    mockOffer = baseOffer
    mockOffer.isDigital = true
    mockOffer.category.categoryType = CategoryType.Thing
    Platform.OS = 'ios'
    mockOffer.stocks = [baseStock]

    const { result } = renderHook(useModalContent)

    expect(result.current.children).toMatchInlineSnapshot('<BookingImpossible />')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Réservation impossible')
  })

  it('iOS - shows BookingDetails if the digital offer is free', () => {
    mockOffer = baseOffer
    mockOffer.isDigital = true
    mockOffer.category.categoryType = CategoryType.Thing
    Platform.OS = 'ios'
    mockOffer.stocks = [{ ...baseStock, price: 0 }]

    const { result } = renderHook(useModalContent)

    expect((result.current.children as any).type.name).toBe('BookingDetails')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Détails de la réservation')
  })

  it('iOS - shows BookingDetails if the offer is a physical good', () => {
    mockOffer = baseOffer
    mockOffer.isDigital = false
    mockOffer.category.categoryType = CategoryType.Thing

    const { result } = renderHook(useModalContent)

    expect((result.current.children as any).type.name).toBe('BookingDetails')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Détails de la réservation')
  })

  it('shows the first step if the offer is an event', () => {
    mockOffer = baseOffer
    mockOffer.category.categoryType = CategoryType.Event

    const { result } = renderHook(useModalContent)

    expect((result.current.children as any).type.name).toBe('BookingEventChoices')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Mes options')
  })

  it('shows the confirmation step if the offer is an event', () => {
    mockOffer = baseOffer
    mockOffer.category.categoryType = CategoryType.Event
    mockStep = Step.CONFIRMATION

    const { result } = renderHook(useModalContent)

    expect((result.current.children as any).type.name).toBe('BookingDetails')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result.current.leftIcon!.name).toBe('ArrowPrevious')
    expect(result.current.onLeftIconPress).not.toBeUndefined()
    expect(result.current.title).toBe('Détails de la réservation')
  })
})
