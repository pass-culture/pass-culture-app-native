import { ActivityIdEnum, UserProfileResponse } from 'api/gen'

import { getIsProfileIncomplete } from './getIsProfileIncomplete'

describe('getIsProfileIncomplete', () => {
  it('returns true if user is undefined', () => {
    expect(getIsProfileIncomplete(undefined)).toBe(true)
  })

  it('returns true if one required field is missing', () => {
    const userMissingCity: Partial<UserProfileResponse> = {
      firstName: 'Jean',
      lastName: 'Dupont',
      postalCode: '75001',
      city: null,
      activityId: ActivityIdEnum.STUDENT,
    }

    expect(getIsProfileIncomplete(userMissingCity as UserProfileResponse)).toBe(true)
  })

  it('returns false if all required fields are present', () => {
    const completeUser: Partial<UserProfileResponse> = {
      firstName: 'Marie',
      lastName: 'Curie',
      postalCode: '75005',
      city: 'Paris',
      activityId: ActivityIdEnum.EMPLOYEE,
    }

    expect(getIsProfileIncomplete(completeUser as UserProfileResponse)).toBe(false)
  })

  it('returns true if multiple fields are missing', () => {
    const userMissingFields: Partial<UserProfileResponse> = {
      firstName: null,
      lastName: undefined,
      postalCode: '13000',
      city: 'Marseille',
      activityId: ActivityIdEnum.EMPLOYEE,
    }

    expect(getIsProfileIncomplete(userMissingFields as UserProfileResponse)).toBe(true)
  })

  it('returns true if one required field is empty string', () => {
    const completeUser: Partial<UserProfileResponse> = {
      firstName: '',
      lastName: 'Curie',
      postalCode: '75005',
      city: 'Paris',
      activityId: ActivityIdEnum.EMPLOYEE,
    }

    expect(getIsProfileIncomplete(completeUser as UserProfileResponse)).toBe(true)
  })
})
