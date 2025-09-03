import { offersStocksResponseTimezonedSnap } from 'features/offer/fixtures/offersStocksResponse'
import { convertOffererDatesToTimezone } from 'features/offer/queries/selectors/convertOffererDatesToTimezone'

describe('convertOffererDatesToTimezone', () => {
  it('should return the converted offerer dates in local timezone of offer address when present', () => {
    const result = convertOffererDatesToTimezone(offersStocksResponseTimezonedSnap)

    expect(result).toBeDefined()
    expect(result?.offers[0]?.stocks[0]?.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
    expect(result?.offers[0]?.stocks[0]?.bookingLimitDatetime).toEqual('2024-05-08T08:50:00.000Z')
    expect(result?.offers[0]?.stocks[0]?.cancellationLimitDatetime).toEqual(
      '2024-05-01T04:35:31.652Z'
    )
    expect(result?.offers[0]?.stocks[1]?.beginningDatetime).toEqual('2024-05-11T04:30:00.000Z')
    expect(result?.offers[0]?.stocks[1]?.bookingLimitDatetime).toEqual('2024-05-11T04:30:00.000Z')
    expect(result?.offers[0]?.stocks[1]?.cancellationLimitDatetime).toEqual(
      '2024-04-30T22:35:31.652Z'
    )
  })

  it('should return dates from the offerer when address is not present', () => {
    const result = convertOffererDatesToTimezone(offersStocksResponseTimezonedSnap)

    expect(result).toBeDefined()
    expect(result?.offers[1]?.stocks[0]?.beginningDatetime).toEqual('2024-05-05T10:45:00.000Z')
    expect(result?.offers[1]?.stocks[0]?.bookingLimitDatetime).toEqual('2024-05-05T10:45:00.000Z')
    expect(result?.offers[1]?.stocks[0]?.cancellationLimitDatetime).toEqual(
      '2024-05-01T10:35:31.653Z'
    )
  })
})
