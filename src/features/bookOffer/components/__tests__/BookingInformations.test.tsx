import * as React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import {
  useBooking,
  useBookingOffer,
  useBookingStock,
} from 'features/bookOffer/pages/BookingOfferWrapper'
import { initialBookingState } from 'features/bookOffer/pages/reducer'
import { render } from 'tests/utils'

import { BookingInformations } from '../BookingInformations'

jest.mock('react-query')
jest.mock('features/auth/settings')
jest.mock('features/bookOffer/pages/BookingOfferWrapper')
jest.mock('libs/address/useFormatFullAddress')
const mockedUseBooking = useBooking as jest.Mock
const mockedUseBookingOffer = useBookingOffer as jest.Mock
const mockedUseBookingStock = useBookingStock as jest.Mock

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
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })

    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
      price: 0,
      activationCode: { expirationDate: '2020-12-01T00:00:00Z' },
    })
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should display unique price when quantity is unique', async () => {
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

  it('should display location when offer is not digital', async () => {
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
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.CARTE_CINE_ILLIMITE,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })

    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: '2020-12-01T00:00:00Z',
      price: 0,
    })
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })
})
