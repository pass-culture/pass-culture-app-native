import mockdate from 'mockdate'

import { getEventOnSiteWithdrawLabelV2 } from 'features/bookings/helpers'

const initialBookingEventDate = new Date('2022-04-22T20:30:00')

mockdate.set(initialBookingEventDate)

describe('getEventOnSiteWithdrawLabel', () => {
  describe('without withdrawal delay informed', () => {
    it('should return "Billet à retirer sur place" if event in 3 days', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-25T20:30:00',
        0
      )

      expect(message).toEqual('Billet à retirer sur place')
    })

    it('should return "Billet à retirer sur place" if event in 2 days', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-24T20:30:00',
        0
      )

      expect(message).toEqual('Billet à retirer sur place')
    })

    it('should return "Billet à retirer sur place d’ici demain" if event is tomorrow', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-23T20:30:00',
        0
      )

      expect(message).toEqual('Billet à retirer sur place d’ici demain')
    })

    it(`should return "Billet à retirer sur place aujourd’hui" if event is today`, () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-22T20:30:00',
        0
      )

      expect(message).toEqual('Billet à retirer sur place aujourd’hui')
    })
  })

  describe('with withdrawal delay less than 24 hours', () => {
    it('should return "Billet à retirer sur place dans 3 jours" if event in 3 days', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-25T20:30:00',
        60 * 60 * 2
      )

      expect(message).toEqual('Billet à retirer sur place dans 3 jours')
    })

    it('should return "Billet à retirer sur place dans 2 jours" if event in 2 days', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-24T20:30:00',
        60 * 60 * 2
      )

      expect(message).toEqual('Billet à retirer sur place dans 2 jours')
    })

    it(`should return "Billet à retirer sur place demain" if event is tomorrow`, () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-23T20:30:00',
        60 * 60 * 2
      )

      expect(message).toEqual('Billet à retirer sur place demain')
    })

    it(`should return "Billet à retirer sur place dès 18h30" if event is today`, () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-22T20:30:00',
        60 * 60 * 2
      )

      expect(message).toEqual('Billet à retirer sur place dès' + ' 18h30')
    })
  })

  describe('with 24 hours withdrawal delay', () => {
    it('should return "Billet à retirer sur place dans 2 jours" if event in 3 days', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-25T20:30:00',
        60 * 60 * 24
      )

      expect(message).toEqual('Billet à retirer sur place dans 2 jours')
    })

    it('should return "Billet à retirer sur place dès demain" if event in 2 days', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-24T20:30:00',
        60 * 60 * 24
      )

      expect(message).toEqual('Billet à retirer sur place dès demain')
    })

    it('should return "Billet à retirer sur place dès aujourd\'hui"if event is tomorrow', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-23T20:30:00',
        60 * 60 * 24
      )

      expect(message).toEqual('Billet à retirer sur place dès aujourd’hui')
    })

    it(`should return "Billet à retirer sur place aujourd’hui" if event is today`, () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-22T20:30:00',
        60 * 60 * 24
      )

      expect(message).toEqual('Billet à retirer sur place aujourd’hui')
    })
  })

  describe('with 48 hours withdrawal delay', () => {
    it('should return "Billet à retirer sur place dès demain" if event in 3 days', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-25T20:30:00',
        60 * 60 * 48
      )

      expect(message).toEqual('Billet à retirer sur place dès demain')
    })

    it('should return "Billet à retirer sur place dès aujourd\'hui"if event in 2 days', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-24T20:30:00',
        60 * 60 * 48
      )

      expect(message).toEqual('Billet à retirer sur place dès aujourd’hui')
    })

    it('should return "Billet à retirer sur place dès aujourd’hui" if event is tomorrow', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-23T20:30:00',
        60 * 60 * 48
      )

      expect(message).toEqual('Billet à retirer sur place dès aujourd’hui')
    })

    it('should return "Billet à retirer sur place aujourd’hui" if event is today', () => {
      const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
        '2022-04-22T20:30:00',
        60 * 60 * 48
      )

      expect(message).toEqual('Billet à retirer sur place aujourd’hui')
    })
  })

  it('should return an empty string if the event will start in more than 3 days', () => {
    const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
      '2022-04-26T20:30:00',
      60 * 60 * 48
    )

    expect(message).toEqual('')
  })

  it('should return an empty string if the event has started', () => {
    mockdate.set(new Date('2022-04-22T20:30:01'))
    const message = getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
      '2022-04-22T20:30:00',
      60 * 60 * 48
    )

    mockdate.reset()

    expect(message).toEqual('')
  })
})
