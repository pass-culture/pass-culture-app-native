import { mockedFullAddress } from 'libs/address/fixtures/mockedFormatFullAddress'

const originalUseFormatFullAddress = jest.requireActual('libs/address/useFormatFullAddress')

export const formatFullAddress = () => mockedFullAddress
export const formatFullAddressWithVenueName = () => mockedFullAddress

export const formatFullAddressStartsWithPostalCode =
  originalUseFormatFullAddress.formatFullAddressStartsWithPostalCode
