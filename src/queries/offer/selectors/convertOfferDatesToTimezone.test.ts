import mockdate from 'mockdate'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { convertOfferDatesToTimezone } from 'queries/offer/selectors/convertOfferDatesToTimezone'
import { mockBuilder } from 'tests/mockBuilder'

const offerWithoutAddressMock = mockBuilder.offerResponseV2({
  address: null,
})

const offerMock = mockBuilder.offerResponseV2({
  address: {
    timezone: 'America/Martinique',
  },
})

describe('convertOfferDatesToTimezone', () => {
  beforeEach(() => mockdate.set(CURRENT_DATE))

  it('should convert offer dates in local timezone', () => {
    const result = convertOfferDatesToTimezone(offerMock)

    expect(result.stocks[0]?.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
    expect(result.stocks[0]?.cancellationLimitDatetime).toEqual('2024-05-01T04:35:31.652Z')
    expect(result.stocks[0]?.bookingLimitDatetime).toEqual('2024-05-08T08:50:00.000Z')
  })

  it('should apply venue address timezone to when offer address is null', () => {
    const result = convertOfferDatesToTimezone(offerWithoutAddressMock)

    expect(result.stocks[0]?.beginningDatetime).toEqual('2024-05-08T14:50:00.000Z')
    expect(result.stocks[0]?.cancellationLimitDatetime).toEqual('2024-05-01T10:35:31.652Z')
    expect(result.stocks[0]?.bookingLimitDatetime).toEqual('2024-05-08T14:50:00.000Z')
  })
})
