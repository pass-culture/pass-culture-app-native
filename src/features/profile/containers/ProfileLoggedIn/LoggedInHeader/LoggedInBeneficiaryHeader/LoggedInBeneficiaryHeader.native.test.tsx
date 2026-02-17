import React from 'react'

import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getAge } from 'shared/user/getAge'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { LoggedInBeneficiaryHeader } from './LoggedInBeneficiaryHeader'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('shared/user/getAge')
const mockedGetAge = getAge as jest.Mock
const mockAge = (age: number) => mockedGetAge.mockReturnValue(age)

const featureFlags = {
  enablePassForAll: false,
  disableActivation: false,
  enableProfileV2: true,
}

describe('LoggedInBeneficiaryHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BONIFICATION])
    mockAge(18)
  })

  it('should render BeneficiaryEmptyHeader for seventeen user with CREDIT_EMPTY', () => {
    mockAge(17)
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_EMPTY,
    })

    expect(screen.getByTestId('beneficiary-empty-header')).toBeOnTheScreen()
  })

  it('should render LoggedInExBeneficiaryHeader for eighteen user with CREDIT_EMPTY', () => {
    mockAge(18)
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_EMPTY,
    })

    expect(screen.getByTestId('logged-in-ex-beneficiary-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryHeader for CREDIT_V1_18', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V1_18,
    })

    expect(screen.getByTestId('beneficiary-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryHeader for CREDIT_V2_15', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V2_15,
    })

    expect(screen.getByTestId('beneficiary-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryHeader for CREDIT_V2_16', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V2_16,
    })

    expect(screen.getByTestId('beneficiary-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryHeader for CREDIT_V2_17', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V2_17,
    })

    expect(screen.getByTestId('beneficiary-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryHeader for CREDIT_V2_18', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V2_18,
    })

    expect(screen.getByTestId('beneficiary-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryFreeHeader for CREDIT_V3_15', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V3_15,
    })

    expect(screen.getByTestId('beneficiary-free-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryFreeHeader for CREDIT_V3_16', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V3_16,
    })

    expect(screen.getByTestId('beneficiary-free-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryHeader for CREDIT_V3_17', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V3_17,
    })

    expect(screen.getByTestId('beneficiary-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryHeader for CREDIT_V3_18', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_V3_18,
    })

    expect(screen.getByTestId('beneficiary-header')).toBeOnTheScreen()
  })

  it('should render BeneficiaryHeader for unknown creditType (default)', () => {
    renderLoggedInBeneficiaryHeader({
      ...beneficiaryUser,
      creditType: UserCreditType.CREDIT_UNKNOWN,
    })

    expect(screen.getByTestId('beneficiary-header')).toBeOnTheScreen()
  })
})

const renderLoggedInBeneficiaryHeader = (user: UserProfileResponseWithoutSurvey) =>
  render(
    reactQueryProviderHOC(<LoggedInBeneficiaryHeader user={user} featureFlags={featureFlags} />)
  )
