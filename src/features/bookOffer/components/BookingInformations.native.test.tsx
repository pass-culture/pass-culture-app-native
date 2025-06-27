import React from 'react'

import { OfferResponseV2, SubcategoryIdEnum } from 'api/gen'
import { initialBookingState } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { offerStockResponseSnap } from 'features/offer/fixtures/offerStockResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { formatDateTimezone } from 'libs/parsers/formatDates'
import { render, screen } from 'tests/utils'

import { BookingInformations } from './BookingInformations'

const randomDatetime = '2020-12-01T00:00:00Z'

jest.mock('features/bookOffer/context/useBookingContext')
jest.mock('features/bookOffer/helpers/useBookingStock')

const mockedUseBooking = jest.mocked(useBookingContext)
const mockedUseBookingStock = jest.mocked(useBookingStock)

jest.mock('libs/subcategories/useSubcategories')

const cinePleinAirOffer = {
  ...baseOffer,
  isDigital: false,
  subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
}

const carteCineOfferDigital = {
  ...baseOffer,
  subcategoryId: SubcategoryIdEnum.CARTE_CINE_ILLIMITE,
  isDigital: true,
}

const mockUseBookingOffer = jest.fn((): OfferResponseV2 | undefined => cinePleinAirOffer)
jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: () => mockUseBookingOffer(),
}))

// This line checks that there is no text content rendered. The regex /./ matches any character, so queryByText will return null if there is no content.
const ANY_CHARACTER = /./

describe('<BookingInformations />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should return empty component when no offer', async () => {
    mockUseBookingOffer.mockReturnValueOnce(undefined)
    render(<BookingInformations />)

    expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
  })

  it('should return empty component when no stock', async () => {
    mockedUseBookingStock.mockReturnValueOnce(undefined)
    render(<BookingInformations />)

    expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
  })

  it('should return empty component when no quantity', async () => {
    mockedUseBooking.mockReturnValueOnce({
      bookingState: { ...initialBookingState, quantity: undefined },
      dispatch: () => null,
      dismissModal: () => null,
    })
    render(<BookingInformations />)

    expect(screen.queryByText(ANY_CHARACTER)).toBeNull()
  })

  it('should render event date section when event', async () => {
    mockUseBookingOffer.mockReturnValueOnce(cinePleinAirOffer)
    render(<BookingInformations />)

    expect(await screen.findByText('Mardi 1er décembre 2020, 01h00 - Durée : 1h')).toBeOnTheScreen()
  })

  it('should display `Gratuit` if price is 0', async () => {
    mockUseBookingOffer.mockReturnValueOnce(cinePleinAirOffer)
    mockedUseBookingStock.mockReturnValueOnce({
      ...offerStockResponseSnap,
      beginningDatetime: randomDatetime,
      price: 0,
      activationCode: { expirationDate: randomDatetime },
    })
    render(<BookingInformations />)

    expect(await screen.findByText('Gratuit')).toBeOnTheScreen()
  })

  it('should display unique price when quantity is unique', async () => {
    mockUseBookingOffer.mockReturnValueOnce(cinePleinAirOffer)

    mockedUseBooking.mockReturnValueOnce({
      bookingState: { ...initialBookingState, quantity: 1 },
      dispatch: () => null,
      dismissModal: () => null,
    })
    render(<BookingInformations />)

    expect(await screen.findByText('0,11 €')).toBeOnTheScreen()
  })

  it('should display stock label when the offer has it', () => {
    mockUseBookingOffer.mockReturnValueOnce(cinePleinAirOffer)

    mockedUseBookingStock.mockReturnValueOnce({
      ...offerStockResponseSnap,
      beginningDatetime: randomDatetime,
      price: 1200,
      priceCategoryLabel: 'A stock label',
    })

    render(<BookingInformations />)

    expect(screen.getByTestId('price-line-label')).toBeOnTheScreen()
  })

  it("shouldn't display stock label when the offer hasn't any", () => {
    mockUseBookingOffer.mockReturnValueOnce(cinePleinAirOffer)

    mockedUseBookingStock.mockReturnValueOnce({
      ...offerStockResponseSnap,
      beginningDatetime: randomDatetime,
      price: 1200,
      priceCategoryLabel: undefined,
    })

    render(<BookingInformations />)

    expect(screen.queryByTestId('price-line-label')).not.toBeOnTheScreen()
  })

  it('should display stock attributes when the offer has it', () => {
    mockUseBookingOffer.mockReturnValueOnce(cinePleinAirOffer)

    mockedUseBookingStock.mockReturnValueOnce({
      ...offerStockResponseSnap,
      beginningDatetime: randomDatetime,
      price: 1200,
      features: ['VOSTFR', '3D', 'IMAX'],
    })

    render(<BookingInformations />)

    expect(screen.getByTestId('price-line-attributes')).toBeOnTheScreen()
  })

  it("shouldn't display stock attributes when the offer hasn't any", () => {
    mockUseBookingOffer.mockReturnValueOnce(cinePleinAirOffer)

    mockedUseBookingStock.mockReturnValueOnce({
      ...offerStockResponseSnap,
      beginningDatetime: randomDatetime,
      price: 1200,
      features: [],
    })

    render(<BookingInformations />)

    expect(screen.queryByTestId('price-line-attributes')).not.toBeOnTheScreen()
  })

  it('should display expirationDate section when offer is digital and has expirationDate', async () => {
    mockUseBookingOffer.mockReturnValueOnce(carteCineOfferDigital)
    render(<BookingInformations />)

    expect(await screen.findByText('À activer avant le 1er décembre 2020')).toBeOnTheScreen()
  })

  it("shouldn't display expirationDate section when offer is digital and has no expirationDate", async () => {
    mockUseBookingOffer.mockReturnValueOnce(carteCineOfferDigital)

    mockedUseBookingStock.mockReturnValueOnce({
      ...offerStockResponseSnap,
      beginningDatetime: randomDatetime,
      price: 0,
    })
    render(<BookingInformations />)

    expect(screen.queryByText('À activer avant le 1er décembre 2020')).not.toBeOnTheScreen()
  })

  it('should display only date if it has no duration information', async () => {
    mockedUseBookingStock.mockReturnValueOnce({
      ...offerStockResponseSnap,
      beginningDatetime: randomDatetime,
    })
    mockUseBookingOffer.mockReturnValueOnce({
      ...cinePleinAirOffer,
      extraData: { durationMinutes: null },
    })

    render(<BookingInformations />)

    expect(await screen.findByText('Mardi 1er décembre 2020, 01h00')).toBeOnTheScreen()
  })

  describe('formatDateTimezone()', () => {
    it.each`
      limitDate                       | expected
      ${'2021-02-23T13:45:00'}        | ${'Mardi 23 février 2021, 13h45'}
      ${new Date(2021, 4, 3, 9, 30)}  | ${'Lundi 3 mai 2021, 09h30'}
      ${new Date(2021, 11, 16, 9, 3)} | ${'Jeudi 16 décembre 2021, 09h03'}
    `(
      'should format Date $limitDate to string "$expected"',
      ({ limitDate, expected }: { limitDate: string; expected: string }) => {
        expect(formatDateTimezone({ limitDate, shouldDisplayWeekDay: true })).toEqual(expected)
      }
    )
  })
})
