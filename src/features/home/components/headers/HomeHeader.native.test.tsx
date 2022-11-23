import React from 'react'

import { UserProfileResponse } from 'api/gen'
import * as Auth from 'features/auth/AuthContext'
import { Credit, useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { render } from 'tests/utils'

import { HomeHeader } from './HomeHeader'

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext')

jest.mock('features/home/services/useAvailableCredit')
const mockUseAvailableCredit = useAvailableCredit as jest.MockedFunction<typeof useAvailableCredit>

jest.mock('libs/geolocation')
const mockUseGeolocation = useGeolocation as jest.Mock

describe('HomeHeader', () => {
  it.each`
    usertype                     | user                                                               | isLoggedIn | credit                                | subtitle
    ${'ex beneficiary'}          | ${{ isBeneficiary: true, isEligibleForBeneficiaryUpgrade: false }} | ${true}    | ${{ amount: 0, isExpired: true }}     | ${'Ton crédit est expiré'}
    ${'beneficiary'}             | ${{ isBeneficiary: true, isEligibleForBeneficiaryUpgrade: false }} | ${true}    | ${{ amount: 5600, isExpired: false }} | ${'Tu as 56 € sur ton pass'}
    ${'eligible ex beneficiary'} | ${{ isBeneficiary: true, isEligibleForBeneficiaryUpgrade: true }}  | ${true}    | ${{ amount: 5, isExpired: true }}     | ${'Toute la culture à portée de main'}
    ${'general'}                 | ${{ isBeneficiary: false }}                                        | ${true}    | ${{ amount: 0, isExpired: false }}    | ${'Toute la culture à portée de main'}
    ${'not logged in'}           | ${undefined}                                                       | ${false}   | ${{ amount: 0, isExpired: false }}    | ${'Toute la culture à portée de main'}
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
      mockUseAuthContext.mockReturnValue({
        isLoggedIn: isLoggedIn,
        user,
        isUserLoading: false,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
      })
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
})
