import * as React from 'react'
import { mocked } from 'ts-jest/utils'

import { initialBookingState } from 'features/bookOffer/pages/reducer'
import { render } from 'tests/utils'

import { useBooking, useBookingOffer, useBookingStock } from '../../pages/BookingOfferWrapper'
import { BookingInformations } from '../BookingInformations'

jest.mock('react-query')
jest.mock('features/auth/settings')
jest.mock('../../pages/BookingOfferWrapper')
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
      fullAddress: 'mon adresse',
      name: 'mon nom',
      stocks: [],
      subcategory: {
        id: 'SEANCE_CINE',
        appLabel: 'Séance Cinéma',
        canBeDuo: true,
        canExpire: true,
        isEvent: true,
      }
    })
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should display free wording is free', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: false,
      fullAddress: 'mon adresse',
      name: 'mon nom',
      stocks: [],
      subcategory: {
        id: 'SEANCE_CINE',
        appLabel: 'Séance Cinéma',
        canBeDuo: true,
        canExpire: true,
        isEvent: true,
      }
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
      fullAddress: 'mon adresse',
      name: 'mon nom',
      stocks: [],
      subcategory: {
        id: 'SEANCE_CINE',
        appLabel: 'Séance Cinéma',
        canBeDuo: true,
        canExpire: true,
        isEvent: true,
      }
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
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should display expirationDate section when offer is digital and has expirationDate', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: true,
      fullAddress: 'mon adresse',
      name: 'mon nom',
      stocks: [],
      subcategory: {
        id: 'LIVRE_PAPIER',
        appLabel: 'Livre papier',
        canBeDuo: false,
        canExpire: false,
        isEvent: false,
      }
    })
    const myComponent = render(<BookingInformations />)
    expect(myComponent).toMatchSnapshot()
  })
  it('should not display expirationDate section when offer is digital and has no expirationDate', async () => {
    // @ts-expect-error mock is not real type
    mockedUseBookingOffer.mockReturnValueOnce({
      isDigital: true,
      fullAddress: 'mon adresse',
      name: 'mon nom',
      stocks: [],
      subcategory: {
        id: 'LIVRE_PAPIER',
        appLabel: 'Livre papier',
        canBeDuo: false,
        canExpire: false,
        isEvent: false,
      }
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
