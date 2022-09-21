import mockdate from 'mockdate'

import { formatSecondsToString } from 'features/bookings/helpers'

describe('formatSecondsToString', () => {
  describe('should display withdrawal wording', () => {
    it.each([1, 60 * 30])('In minutes', (delay) => {
      mockdate.set(new Date('2022-04-22T17:30:00'))
      const message = formatSecondsToString(delay)
      expect(message).toEqual(`${delay / 60} minutes`)
    })

    it('In hour', () => {
      const message = formatSecondsToString(3600)
      expect(message).toEqual('1 heure')
    })

    it.each([60 * 60 * 2, 60 * 60 * 48])('In hours', (delay) => {
      const message = formatSecondsToString(delay)
      expect(message).toEqual(`${delay / 60 / 60} heures`)
    })

    it.each([60 * 60 * 24 * 3, 60 * 60 * 24 * 6])('In days', (delay) => {
      const message = formatSecondsToString(delay)
      expect(message).toEqual(`${delay / 60 / 60 / 24} jours`)
    })

    it('In week', () => {
      const message = formatSecondsToString(60 * 60 * 24 * 7)
      expect(message).toEqual('1 semaine')
    })
  })
})
