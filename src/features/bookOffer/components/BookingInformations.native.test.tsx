import * as React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { initialBookingState } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatDateTimezone } from 'libs/parsers'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { render, screen } from 'tests/utils'

import { BookingInformations } from './BookingInformations'

jest.mock('react-query')

jest.mock('features/bookOffer/context/useBookingContext')
jest.mock('features/bookOffer/helpers/useBookingStock')
jest.mock('features/bookOffer/helpers/useBookingOffer')

jest.mock('libs/address/useFormatFullAddress')
const mockedUseBooking = jest.mocked(useBookingContext)
const mockedUseBookingOffer = jest.mocked(useBookingOffer)
const mockedUseBookingStock = jest.mocked(useBookingStock)

const mockSubcategories = placeholderData.subcategories
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
    },
  }),
}))

describe('<BookingInformations />', () => {
  it('should return empty component when no offer', async () => {
    mockedUseBookingOffer.mockReturnValueOnce(undefined)
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should return empty component when no stock', async () => {
    mockedUseBookingStock.mockReturnValueOnce(undefined)
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should return empty component when no quantity', async () => {
    mockedUseBooking.mockReturnValueOnce({
      bookingState: { ...initialBookingState, quantity: undefined },
      dispatch: () => null,
      dismissModal: () => null,
    })
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should render event date section when event', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should display free wording is free', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
      price: 0,
      activationCode: { expirationDate: '2020-12-01T00:00:00Z' },
    })
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should display unique price when quantity is unique', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    mockedUseBooking.mockReturnValueOnce({
      bookingState: { ...initialBookingState, quantity: 1 },
      dispatch: () => null,
      dismissModal: () => null,
    })
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should display stock label', () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })

    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
      price: 1200,
      priceCategoryLabel: 'A stock label',
    })

    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()

    expect(screen.getByTestId('price-line__label')).toBeOnTheScreen()
  })

  it('should display stock attributes when the offer has it', () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
      price: 1200,
      features: ['VOSTFR', '3D', 'IMAX'],
    })
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })

    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()

    expect(screen.getByText('- VOSTFR 3D IMAX')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line__attributes')).toBeOnTheScreen()
  })

  it('should not display stock attributes when the offer has not it', () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
      price: 1200,
      features: [],
    })
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })

    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()

    expect(screen.queryByTestId('price-line__attributes')).not.toBeOnTheScreen()
  })

  it('should display location when offer is not digital', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      name: 'mon nom',
      stocks: [],
      subcategoryId: SubcategoryIdEnum.CARTE_CINE_ILLIMITE,
      venue: mockOffer.venue,
    })
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should display expirationDate section when offer is digital and has expirationDate', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.CARTE_CINE_ILLIMITE,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should not display expirationDate section when offer is digital and has no expirationDate', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.CARTE_CINE_ILLIMITE,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
      price: 0,
    })
    render(<BookingInformations />)

    expect(screen).toMatchSnapshot()
  })

  it('should not display address', () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.CARTE_CINE_ILLIMITE,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    render(<BookingInformations />)

    expect(screen.queryByText('RUE DE CALI')).not.toBeOnTheScreen()
  })

  it("shouldn't display duration if it has no duration information", () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
    })
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'Pas de durée',
      stocks: [],
      venue: mockOffer.venue,
      extraData: { durationMinutes: null },
    })
    render(<BookingInformations />)

    expect(screen.queryByText('Mardi 1 décembre 2020, 01h00 - Durée : 1h')).not.toBeOnTheScreen()
  })

  it('should display duration if it has duration information', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
    })
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'Offre cinéma avec une duration',
      stocks: [],
      venue: mockOffer.venue,
      extraData: { durationMinutes: 60 },
    })

    render(<BookingInformations />)

    expect(await screen.findByText('Mardi 1 décembre 2020, 01h00 - Durée : 1h')).toBeVisible()
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
        const shouldShowWeekDay = true

        expect(formatDateTimezone(limitDate, shouldShowWeekDay)).toEqual(expected)
      }
    )
  })
})
