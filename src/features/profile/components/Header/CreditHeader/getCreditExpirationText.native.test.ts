import { addDays, subDays } from 'date-fns'

import { getCreditExpirationText } from 'features/profile/components/Header/CreditHeader/getCreditExpirationText'

const today = new Date()

describe('getCreditExpirationText', () => {
  it('should get nothing when expiration date is in more than 7 days', () => {
    const creditExpirationDay = addDays(today, 8)
    const text = getCreditExpirationText(creditExpirationDay, today)
    expect(text).toBeUndefined()
  })

  it('should get nothing when expiration date is past', () => {
    const creditExpirationDay = subDays(today, 1)
    const text = getCreditExpirationText(creditExpirationDay, today)
    expect(text).toBeUndefined()
  })

  it('should get message text saying your credit will be reset today when expiration date is today', () => {
    const creditExpirationDay = today
    const text = getCreditExpirationText(creditExpirationDay, today)
    expect(text).toEqual(
      'Ton crédit sera remis à 0 aujourd’hui. Profite de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be reset tomorrow when expiration date is tomorrow', () => {
    const creditExpirationDay = addDays(today, 1)
    const text = getCreditExpirationText(creditExpirationDay, today)
    expect(text).toEqual(
      'Ton crédit sera remis à 0 dans 1 jour. Profite de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be reset in 2 days when expiration date is in 2 days', () => {
    const creditExpirationDay = addDays(today, 2)
    const text = getCreditExpirationText(creditExpirationDay, today)
    expect(text).toEqual(
      'Ton crédit sera remis à 0 dans 2 jours. Profite de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be reset in 7 days when expiration date is in 7 days', () => {
    const creditExpirationDay = addDays(today, 7)
    const text = getCreditExpirationText(creditExpirationDay, today)
    expect(text).toEqual(
      'Ton crédit sera remis à 0 dans 7 jours. Profite de ton crédit restant\u00a0!'
    )
  })
})
