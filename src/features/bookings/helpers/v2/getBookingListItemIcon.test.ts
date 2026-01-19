import { WithdrawalTypeEnum } from 'api/gen'
import { getBookingListItemIcon } from 'features/bookings/helpers/v2/getBookingListItemIcon'

describe('getBookingListItemIcon', () => {
  it('should return "digital" when the offer is digital', () => {
    const icon = getBookingListItemIcon({
      isDigital: true,
      withdrawalType: WithdrawalTypeEnum.on_site,
    })

    expect(icon).toEqual('digital')
  })

  it('should return "tickets" when the offer is physical and withdrawal is on site', () => {
    const icon = getBookingListItemIcon({
      isDigital: false,
      withdrawalType: WithdrawalTypeEnum.on_site,
    })

    expect(icon).toEqual('tickets')
  })

  it('should return "clock" for other cases (physical offer without on_site withdrawal)', () => {
    const icon = getBookingListItemIcon({
      isDigital: false,
      withdrawalType: undefined,
    })

    expect(icon).toEqual('clock')
  })
})
