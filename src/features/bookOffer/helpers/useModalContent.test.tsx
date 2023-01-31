/* eslint-disable @typescript-eslint/no-explicit-any */
import { Platform } from 'react-native'

import { OfferResponse, SubcategoryIdEnum } from 'api/gen'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { Step } from 'features/bookOffer/pages/reducer'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import { renderHook } from 'tests/utils'

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
  it('show default modal if no information yet', () => {
    mockOffer = undefined

    const { result } = renderHook(useModalContent)

    expect(result.current.children).toMatchInlineSnapshot('<React.Fragment />')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('')
  })

  it('iOS - does not show BookingImpossible if the digital offer is CINEMA', () => {
    mockOffer = baseOffer
    mockOffer.isDigital = true
    mockOffer.subcategoryId = SubcategoryIdEnum.CARTE_CINE_ILLIMITE
    Platform.OS = 'ios'
    mockOffer.stocks = [offerStockResponseSnap]

    const { result } = renderHook(useModalContent)

    expect(result.current.children).toMatchInlineSnapshot(`
      <BookingDetails
        stocks={
          Array [
            Object {
              "beginningDatetime": "2021-01-01T13:30:00",
              "bookingLimitDatetime": "2021-01-05T13:30:00",
              "id": 118929,
              "isBookable": true,
              "isExpired": false,
              "isForbiddenToUnderage": false,
              "isSoldOut": false,
              "price": 500,
            },
          ]
        }
      />
    `)
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Détails de la réservation')
  })

  it('iOS - shows BookingImpossible if the digital offer is not free', () => {
    mockOffer = baseOffer
    mockOffer.isDigital = true
    mockOffer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
    Platform.OS = 'ios'
    mockOffer.stocks = [offerStockResponseSnap]

    const { result } = renderHook(useModalContent)

    expect(result.current.children).toMatchInlineSnapshot('<BookingImpossible />')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Tu y es presque')
  })

  it('iOS - shows BookingDetails if the digital offer is free', () => {
    mockOffer = baseOffer
    mockOffer.isDigital = true
    mockOffer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
    Platform.OS = 'ios'
    mockOffer.stocks = [{ ...offerStockResponseSnap, price: 0 }]

    const { result } = renderHook(useModalContent)

    expect((result.current.children as any).type.name).toBe('BookingDetails')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Détails de la réservation')
  })

  it('iOS - shows BookingDetails if the offer is a physical good', () => {
    mockOffer = baseOffer
    mockOffer.isDigital = false
    mockOffer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

    const { result } = renderHook(useModalContent)

    expect((result.current.children as any).type.name).toBe('BookingDetails')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Détails de la réservation')
  })

  it('shows the first step if the offer is an event', () => {
    mockOffer = baseOffer
    mockOffer.subcategoryId = SubcategoryIdEnum.CINE_PLEIN_AIR

    const { result } = renderHook(useModalContent)

    expect((result.current.children as any).type.name).toBe('BookingEventChoices')
    expect(result.current.leftIcon).toBeUndefined()
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Mes options')
  })

  it('shows the confirmation step if the offer is an event', () => {
    mockOffer = baseOffer
    mockOffer.subcategoryId = SubcategoryIdEnum.CINE_PLEIN_AIR
    mockStep = Step.CONFIRMATION

    const { result } = renderHook(useModalContent)

    expect((result.current.children as any).type.name).toBe('BookingDetails')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(result.current.leftIcon!.displayName).toBe('Styled(ArrowPreviousSvg)')
    expect(result.current.onLeftIconPress).not.toBeUndefined()
    expect(result.current.title).toBe('Détails de la réservation')
  })

  it('shows modal AlreadyBooked when isEndedUsedBooking is true', () => {
    mockOffer = baseOffer
    mockOffer.subcategoryId = SubcategoryIdEnum.CINE_PLEIN_AIR
    mockStep = Step.CONFIRMATION

    const { result } = renderHook(() => useModalContent(true))

    expect((result.current.children as any).type.name).toBe('AlreadyBooked')
    expect(result.current.onLeftIconPress).toBeUndefined()
    expect(result.current.title).toBe('Réservation impossible')
  })
})
