import { addDays, subDays } from 'date-fns'

import { getCreditExpirationText } from 'features/profile/components/Header/CreditHeader/getCreditExpirationText'

const today = new Date()

describe('getCreditExpirationText', () => {
  it('should get nothing when expiration date is in more than 7 days for underage', () => {
    const creditExpirationDay = addDays(today, 8)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'underageBeneficiary',
    })

    expect(text).toBeUndefined()
  })

  it('should get nothing when expiration date is past for underage', () => {
    const creditExpirationDay = subDays(today, 1)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'underageBeneficiary',
    })

    expect(text).toBeUndefined()
  })

  it('should get message text saying your credit will be reset today when expiration date is today for underage', () => {
    const creditExpirationDay = today
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'underageBeneficiary',
    })

    expect(text).toEqual(
      'Ton crédit sera remis à 0 aujourd’hui. Profite rapidement de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be reset tomorrow when expiration date is tomorrow for underage', () => {
    const creditExpirationDay = addDays(today, 1)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'underageBeneficiary',
    })

    expect(text).toEqual(
      'Ton crédit sera remis à 0 dans 1 jour. Profite rapidement de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be reset in 2 days when expiration date is in 2 days for underage', () => {
    const creditExpirationDay = addDays(today, 2)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'underageBeneficiary',
    })

    expect(text).toEqual(
      'Ton crédit sera remis à 0 dans 2 jours. Profite rapidement de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be reset in 7 days when expiration date is in 7 days for underage', () => {
    const creditExpirationDay = addDays(today, 7)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'underageBeneficiary',
    })

    expect(text).toEqual(
      'Ton crédit sera remis à 0 dans 7 jours. Profite rapidement de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be expired in 1 day when expiration date is in 1 day for 18 yo', () => {
    const creditExpirationDay = addDays(today, 1)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'beneficiary',
    })

    expect(text).toEqual(
      'Ton crédit expire dans 1 jour. Profite rapidement de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be expired in 2 days when expiration date is in 2 days for 18 yo', () => {
    const creditExpirationDay = addDays(today, 2)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'beneficiary',
    })

    expect(text).toEqual(
      'Ton crédit expire dans 2 jours. Profite rapidement de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be expired in 7 days when expiration date is in 7 days for 18 yo', () => {
    const creditExpirationDay = addDays(today, 7)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'beneficiary',
    })

    expect(text).toEqual(
      'Ton crédit expire dans 7 jours. Profite rapidement de ton crédit restant\u00a0!'
    )
  })

  it('should get message text saying your credit will be reset today when expiration date is today for 18 yo', () => {
    const creditExpirationDay = today
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'beneficiary',
    })

    expect(text).toEqual(
      'Ton crédit expire aujourd’hui. Profite rapidement de ton crédit restant\u00a0!'
    )
  })

  it('should get nothing when expiration date is in more than 7 days for 18 yo', () => {
    const creditExpirationDay = addDays(today, 8)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'beneficiary',
    })

    expect(text).toBeUndefined()
  })

  it('should get nothing when expiration date is past for 18 yo', () => {
    const creditExpirationDay = subDays(today, 1)
    const text = getCreditExpirationText({
      depositExpirationDate: creditExpirationDay,
      baseDate: today,
      userStatus: 'beneficiary',
    })

    expect(text).toBeUndefined()
  })
})
