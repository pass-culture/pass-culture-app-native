import * as React from 'react'
import { mocked } from 'ts-jest/utils'

import { SubcategoryIdEnum } from 'api/gen'
import { initialBookingState } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { render } from 'tests/utils'

import { BookingInformations } from './BookingInformations'

jest.mock('react-query')

jest.mock('features/bookOffer/context/useBookingContext')
jest.mock('features/bookOffer/helpers/useBookingStock')
jest.mock('features/bookOffer/helpers/useBookingOffer')

jest.mock('libs/address/useFormatFullAddress')
const mockedUseBooking = mocked(useBookingContext)
const mockedUseBookingOffer = mocked(useBookingOffer)
const mockedUseBookingStock = mocked(useBookingStock)

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
})
