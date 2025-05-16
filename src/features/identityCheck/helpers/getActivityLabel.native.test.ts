import { ActivityIdEnum } from 'api/gen'

import { getActivityLabel } from './getActivityLabel'

describe('getActivityLabel', () => {
  it('should return "Collégien" for MIDDLE_SCHOOL_STUDENT', () => {
    expect(getActivityLabel(ActivityIdEnum.MIDDLE_SCHOOL_STUDENT)).toBe('Collégien')
  })

  it('should return "Lycéen" for HIGH_SCHOOL_STUDENT', () => {
    expect(getActivityLabel(ActivityIdEnum.HIGH_SCHOOL_STUDENT)).toBe('Lycéen')
  })

  it('should return "Étudiant" for STUDENT', () => {
    expect(getActivityLabel(ActivityIdEnum.STUDENT)).toBe('Étudiant')
  })

  it('should return "Employé" for EMPLOYEE', () => {
    expect(getActivityLabel(ActivityIdEnum.EMPLOYEE)).toBe('Employé')
  })

  it('should return "Apprenti" for APPRENTICE', () => {
    expect(getActivityLabel(ActivityIdEnum.APPRENTICE)).toBe('Apprenti')
  })

  it('should return "Alternant" for APPRENTICE_STUDENT', () => {
    expect(getActivityLabel(ActivityIdEnum.APPRENTICE_STUDENT)).toBe('Alternant')
  })

  it('should return "Volontaire" for VOLUNTEER', () => {
    expect(getActivityLabel(ActivityIdEnum.VOLUNTEER)).toBe('Volontaire')
  })

  it('should return "Inactif" for INACTIVE', () => {
    expect(getActivityLabel(ActivityIdEnum.INACTIVE)).toBe('Inactif')
  })

  it('should return "Demandeur d’emploi" for UNEMPLOYED', () => {
    expect(getActivityLabel(ActivityIdEnum.UNEMPLOYED)).toBe('Demandeur d’emploi')
  })

  it('should return undefined if activityId is undefined', () => {
    expect(getActivityLabel(undefined)).toBeUndefined()
  })

  it('should return undefined if activityId is null', () => {
    expect(getActivityLabel(null)).toBeUndefined()
  })

  it('should return undefined for an invalid activity ID', () => {
    // @ts-expect-error: purposely using an invalid value
    expect(getActivityLabel('INVALID')).toBeUndefined()
  })
})
