import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { Credit, useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { useUserProfileInfo } from 'features/profile/api'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { UsePersistQueryResult } from 'libs/react-query/usePersistQuery'
import { render } from 'tests/utils'

import { HomeHeader } from './HomeHeader'

jest.mock('features/profile/api')
const mockUseUserProfileInfo = useUserProfileInfo as jest.MockedFunction<typeof useUserProfileInfo>

jest.mock('features/home/services/useAvailableCredit')
const mockUseAvailableCredit = useAvailableCredit as jest.MockedFunction<typeof useAvailableCredit>

jest.mock('libs/geolocation')
const mockUseGeolocation = useGeolocation as jest.Mock

describe('HomeHeader', () => {
  it.each`
    usertype                     | user                                                                         | credit                                | subtitle
    ${'ex beneficiary'}          | ${{ data: { isBeneficiary: true, isEligibleForBeneficiaryUpgrade: false } }} | ${{ amount: 0, isExpired: true }}     | ${'Ton crédit est expiré'}
    ${'beneficiary'}             | ${{ data: { isBeneficiary: true, isEligibleForBeneficiaryUpgrade: false } }} | ${{ amount: 5600, isExpired: false }} | ${'Tu as 56 € sur ton pass'}
    ${'eligible ex beneficiary'} | ${{ data: { isBeneficiary: true, isEligibleForBeneficiaryUpgrade: true } }}  | ${{ amount: 5, isExpired: true }}     | ${'Toute la culture à portée de main'}
    ${'general'}                 | ${{ data: { isBeneficiary: false } }}                                        | ${{ amount: 0, isExpired: false }}    | ${'Toute la culture à portée de main'}
    ${'not logged in'}           | ${{ data: undefined }}                                                       | ${{ amount: 0, isExpired: false }}    | ${'Toute la culture à portée de main'}
  `(
    '$usertype users should see subtitle: $subtitle',
    ({
      user,
      credit,
      subtitle,
    }: {
      user: UserProfileResponse
      credit: Credit
      subtitle: string
    }) => {
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

    expect(queryByText('Géolocalise toi')).toBeFalsy()
  })

  it('should display geolocation banner when geolocation is denied', () => {
    mockUseGeolocation.mockReturnValueOnce({ permissionState: GeolocPermissionState.DENIED })
    const { queryByText } = render(<HomeHeader />)

    expect(queryByText('Géolocalise toi')).toBeTruthy()
  })

  it('should display geolocation banner when geolocation is never ask again', () => {
    mockUseGeolocation.mockReturnValueOnce({
      permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
    })
    const { queryByText } = render(<HomeHeader />)

    expect(queryByText('Géolocalise toi')).toBeTruthy()
  })
})
