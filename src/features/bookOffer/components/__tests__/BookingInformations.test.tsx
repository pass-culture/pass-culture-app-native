import * as React from 'react'
import { mocked } from 'ts-jest/utils'

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
const mockedUseBooking = mocked(useBooking)
const mockedUseBookingOffer = mocked(useBookingOffer)
const mockedUseBookingStock = mocked(useBookingStock)

describe('<BookingInformations />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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
      subcategoryId: SubcategoryIdEnum.CINEPLEINAIR,
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
      subcategoryId: SubcategoryIdEnum.CINEPLEINAIR,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: new Date('2020-12-01T00:00:00Z'),
      price: 0,
      activationCode: { expirationDate: new Date('2020-12-01T00:00:00Z') },
    })
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should display unique price when quantity is unique', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      subcategoryId: SubcategoryIdEnum.CINEPLEINAIR,
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
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      name: 'mon nom',
      stocks: [],
      subcategoryId: SubcategoryIdEnum.CARTECINEILLIMITE,
      venue: mockOffer.venue,
    })
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should display expirationDate section when offer is digital and has expirationDate', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.CARTECINEILLIMITE,
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
      subcategoryId: SubcategoryIdEnum.CARTECINEILLIMITE,
      name: 'mon nom',
      stocks: [],
      venue: mockOffer.venue,
    })
    // @ts-expect-error mock is not real type
    mockedUseBookingStock.mockReturnValueOnce({
      beginningDatetime: new Date('2020-12-01T00:00:00Z'),
      price: 0,
    })
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })
})
