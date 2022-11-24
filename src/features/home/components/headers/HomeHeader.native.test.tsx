import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { Credit, useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { useUserProfileInfo } from 'features/profile/api'
import { env } from 'libs/environment'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { UsePersistQueryResult } from 'libs/react-query/usePersistQuery'
import { render } from 'tests/utils'

import { HomeHeader } from './HomeHeader'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('features/profile/api')
const mockUseUserProfileInfo = useUserProfileInfo as jest.MockedFunction<typeof useUserProfileInfo>

jest.mock('features/home/services/useAvailableCredit')
const mockUseAvailableCredit = useAvailableCredit as jest.MockedFunction<typeof useAvailableCredit>

jest.mock('libs/geolocation')
const mockUseGeolocation = useGeolocation as jest.Mock

describe('HomeHeader', () => {
  it.each`
    usertype                     | user                                                                         | isLoggedIn | credit                                | subtitle
    ${'ex beneficiary'}          | ${{ data: { isBeneficiary: true, isEligibleForBeneficiaryUpgrade: false } }} | ${true}    | ${{ amount: 0, isExpired: true }}     | ${'Ton crédit est expiré'}
    ${'beneficiary'}             | ${{ data: { isBeneficiary: true, isEligibleForBeneficiaryUpgrade: false } }} | ${true}    | ${{ amount: 5600, isExpired: false }} | ${'Tu as 56 € sur ton pass'}
    ${'eligible ex beneficiary'} | ${{ data: { isBeneficiary: true, isEligibleForBeneficiaryUpgrade: true } }}  | ${true}    | ${{ amount: 5, isExpired: true }}     | ${'Toute la culture à portée de main'}
    ${'general'}                 | ${{ data: { isBeneficiary: false } }}                                        | ${true}    | ${{ amount: 0, isExpired: false }}    | ${'Toute la culture à portée de main'}
    ${'not logged in'}           | ${{ data: undefined }}                                                       | ${false}   | ${{ amount: 0, isExpired: false }}    | ${'Toute la culture à portée de main'}
  `(
    '$usertype users should see subtitle: $subtitle',
    ({
      user,
      isLoggedIn,
      credit,
      subtitle,
    }: {
      user: UserProfileResponse
      isLoggedIn: boolean
      credit: Credit
      subtitle: string
    }) => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: jest.fn(),
      })
      mockUseUserProfileInfo.mockReturnValueOnce(
        user as unknown as UsePersistQueryResult<UserProfileResponse, unknown>
      )
      mockUseAvailableCredit.mockReturnValueOnce(credit)

      const { getByText } = render(<HomeHeader />)
      expect(getByText(subtitle)).toBeTruthy()
    }
  )

  it('should not display geolocation banner when geolocation is granted', () => {
    const { queryByText } = render(<HomeHeader />)

    expect(queryByText('Géolocalise-toi')).toBeFalsy()
  })

  it('should display geolocation banner when geolocation is denied', () => {
    mockUseGeolocation.mockReturnValueOnce({ permissionState: GeolocPermissionState.DENIED })
    const { queryByText } = render(<HomeHeader />)

    expect(queryByText('Géolocalise-toi')).toBeTruthy()
  })

  it('should display geolocation banner when geolocation is never ask again', () => {
    mockUseGeolocation.mockReturnValueOnce({
      permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
    })
    const { queryByText } = render(<HomeHeader />)

    expect(queryByText('Géolocalise-toi')).toBeTruthy()
  })

  it('should have CheatMenu button when FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=true', () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    const { getByText } = render(<HomeHeader />)
    expect(getByText('CheatMenu')).toBeTruthy()
  })

  it('should NOT have CheatMenu button when NOT FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=false', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    const { queryByText } = render(<HomeHeader />)
    expect(queryByText('CheatMenu')).toBeNull()
  })
})
