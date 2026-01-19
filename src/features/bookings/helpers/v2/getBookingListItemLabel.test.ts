import { getBookingListItemLabel } from 'features/bookings/helpers/v2/getBookingListItemLabel'

describe('getBookingListItemLabel', () => {
  const defaultProps = {
    dateLabel: 'Le 15 janvier',
    canDisplayExpirationMessage: false,
    correctExpirationMessages: 'J-2',
    withdrawLabel: undefined,
  }

  it('should prioritize and return the withdraw label when defined', () => {
    const label = getBookingListItemLabel({
      ...defaultProps,
      withdrawLabel: 'À retirer au guichet',
      canDisplayExpirationMessage: true,
    })

    expect(label).toEqual('À retirer au guichet')
  })

  it('should return the expiration message if no withdraw label is present but expiration is allowed', () => {
    const label = getBookingListItemLabel({
      ...defaultProps,
      withdrawLabel: undefined,
      canDisplayExpirationMessage: true,
      correctExpirationMessages: 'Expire demain',
    })

    expect(label).toEqual('Expire demain')
  })

  it('should return the date label by default', () => {
    const label = getBookingListItemLabel({
      ...defaultProps,
      withdrawLabel: undefined,
      canDisplayExpirationMessage: false,
      dateLabel: 'Validé le 20 mars',
    })

    expect(label).toEqual('Validé le 20 mars')
  })
})
