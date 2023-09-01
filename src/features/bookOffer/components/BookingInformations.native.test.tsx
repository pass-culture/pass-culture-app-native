import * as React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { initialBookingState } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
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

const mockUseFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

describe('<BookingInformations />', () => {
  it('should return empty component when no offer', async () => {
    mockedUseBookingOffer.mockReturnValueOnce(undefined)
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should return empty component when no stock', async () => {
    mockedUseBookingStock.mockReturnValueOnce(undefined)
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should return empty component when no quantity', async () => {
    mockedUseBooking.mockReturnValueOnce({
      bookingState: { ...initialBookingState, quantity: undefined },
      dispatch: () => null,
      dismissModal: () => null,
    })
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
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
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
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
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
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
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
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

    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()

    expect(screen.getByTestId('price-line__label')).toBeOnTheScreen()
  })

  describe('When wipAttributesCinemaOffers feature flag activated', () => {
    beforeEach(() => {
      mockUseFeatureFlag.mockReturnValueOnce(true)

      // @ts-expect-error mock is not real type
      mockedUseBookingOffer.mockReturnValueOnce({
        isDigital: false,
        subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
        name: 'mon nom',
        stocks: [],
        venue: mockOffer.venue,
      })
    })

    it('should display stock attributes when the offer has it', () => {
      // @ts-expect-error mock is not real type
      mockedUseBookingStock.mockReturnValueOnce({
        beginningDatetime: '2020-12-01T00:00:00Z',
        price: 1200,
        features: ['VOSTFR', '3D', 'IMAX'],
      })

      const myComponent = render(<BookingInformations />)
      expect(myComponent).toMatchSnapshot()

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

      const myComponent = render(<BookingInformations />)
      expect(myComponent).toMatchSnapshot()

      expect(screen.queryByTestId('price-line__attributes')).toBeFalsy()
    })
  })

  describe('When wipAttributesCinemaOffers feature flag deactivated', () => {
    beforeEach(() => {
      mockUseFeatureFlag.mockReturnValueOnce(false)

      // @ts-expect-error mock is not real type
      mockedUseBookingOffer.mockReturnValueOnce({
        isDigital: false,
        subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
        name: 'mon nom',
        stocks: [],
        venue: mockOffer.venue,
      })
    })

    it('should not display stock attributes when the offer has it', () => {
      // @ts-expect-error mock is not real type
      mockedUseBookingStock.mockReturnValueOnce({
        beginningDatetime: '2020-12-01T00:00:00Z',
        price: 1200,
        features: ['VOSTFR', '3D', 'IMAX'],
      })

      const myComponent = render(<BookingInformations />)
      expect(myComponent).toMatchSnapshot()

      expect(screen.queryByTestId('price-line__attributes')).toBeFalsy()
    })

    it('should not display stock attributes when the offer has not it', () => {
      // @ts-expect-error mock is not real type
      mockedUseBookingStock.mockReturnValueOnce({
        beginningDatetime: '2020-12-01T00:00:00Z',
        price: 1200,
        features: [],
      })

      const myComponent = render(<BookingInformations />)
      expect(myComponent).toMatchSnapshot()

      expect(screen.queryByTestId('price-line__attributes')).toBeFalsy()
    })
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
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
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
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
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
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should not display address when shouldDisplayAddress = false', () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.CARTE_CINE_ILLIMITE,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    render(<BookingInformations shouldDisplayAddress={false} />)
    expect(screen.queryByText('RUE DE CALI')).toBeNull()
  })
})
