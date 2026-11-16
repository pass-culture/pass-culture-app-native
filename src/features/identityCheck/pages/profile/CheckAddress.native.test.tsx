import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { CheckAddress } from 'features/identityCheck/pages/profile/CheckAddress'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { beneficiaryUser, beneficiaryUserFromAPI, nonBeneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import * as snackBarStore from 'ui/designSystem/Snackbar/snackBar.store'

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ user: null })),
}))

const mockSaveStep = jest.fn().mockResolvedValue(undefined)
jest.mock('features/identityCheck/pages/helpers/useSaveStep', () => ({
  useSaveStep: () => mockSaveStep,
}))

const mockNavigateForwardToStepper = jest.fn()
jest.mock('features/identityCheck/helpers/useNavigateForwardToStepper', () => ({
  useNavigateForwardToStepper: jest.fn(),
}))

let mockIdentityCheckMethod: string | null = 'dms'
jest.mock('features/identityCheck/queries/useGetStepperInfoQuery', () => ({
  useGetStepperInfoQuery: () => ({
    data: { underageOkIdentityCheckMethod: mockIdentityCheckMethod },
  }),
}))

const postProfileSpy = jest.spyOn(api, 'postNativeV1SubscriptionProfile')
const patchProfileSpy = jest.spyOn(api, 'patchNativeV1Profile')
const postHonorStatementSpy = jest.spyOn(api, 'postNativeV1SubscriptionHonorStatement')
const showErrorSnackBarSpy = jest.spyOn(snackBarStore, 'showErrorSnackBar')
const mockRefetchUser = jest.fn()
const user = userEvent.setup()

describe('<CheckAddress />', () => {
  beforeEach(() => {
    useRoute.mockReset()
    useRoute.mockReturnValue({ params: undefined })
    jest.mocked(useNavigateForwardToStepper).mockReturnValue({
      navigateForwardToStepper: mockNavigateForwardToStepper,
    })
    mockIdentityCheckMethod = 'dms'
    mockSaveStep.mockResolvedValue(undefined)
    mockAuthContextWithUser(beneficiaryUser, { persist: true, refetchUser: mockRefetchUser })
    patchProfileSpy.mockResolvedValue(beneficiaryUserFromAPI)
    postProfileSpy.mockResolvedValue({})
    postHonorStatementSpy.mockResolvedValue({})
    mockRefetchUser.mockResolvedValue({ data: beneficiaryUser, isError: false })
  })

  it('should ask if the user still lives at the address by default', () => {
    useRoute.mockReturnValueOnce({ params: undefined })

    renderCheckAddress()

    expect(screen.getByText('Habites-tu toujours à cette adresse\u00a0?')).toBeOnTheScreen()
  })

  it('should ask the user to verify their information when coming from ChangeAddress', () => {
    useRoute.mockReturnValueOnce({ params: { fromChangeAddress: true } })

    renderCheckAddress()

    expect(
      screen.getByText('Vérifie que ces informations sont correctes avant de continuer')
    ).toBeOnTheScreen()
  })

  it.each(['dms', 'ubble'])(
    'should patch only the address before navigating to the beneficiary confirmation for %s',
    async (method) => {
      mockIdentityCheckMethod = method
      let resolveProfile: () => void = () => undefined
      patchProfileSpy.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveProfile = () => resolve(beneficiaryUserFromAPI)
        })
      )
      renderCheckAddress()

      await validateAddress()

      expect(patchProfileSpy).toHaveBeenCalledWith({
        address: beneficiaryUser.street,
        city: beneficiaryUser.city,
        postalCode: beneficiaryUser.postalCode,
      })
      expect(postProfileSpy).not.toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
      expect(mockSaveStep).not.toHaveBeenCalled()
      expect(postHonorStatementSpy).not.toHaveBeenCalled()

      resolveProfile()

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
          screen: 'BeneficiaryAccountCreated',
          params: { from: 'CheckAddress' },
        })
      )

      expect(mockSaveStep).toHaveBeenCalledWith(IdentityCheckStep.PROFILE)
      expect(postProfileSpy).toHaveBeenCalledWith({
        firstName: beneficiaryUser.firstName,
        lastName: beneficiaryUser.lastName,
        activityId: beneficiaryUser.activityId,
        address: beneficiaryUser.street,
        city: beneficiaryUser.city,
        postalCode: beneficiaryUser.postalCode,
        schoolTypeId: null,
      })
      expect(mockRefetchUser).toHaveBeenCalledWith()
      expect(postHonorStatementSpy).toHaveBeenCalledTimes(1)
      expect(mockNavigateForwardToStepper).not.toHaveBeenCalled()
    }
  )

  it('should preserve the stepper navigation for other identity check methods', async () => {
    mockIdentityCheckMethod = null
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(mockNavigateForwardToStepper).toHaveBeenCalledTimes(1))

    expect(patchProfileSpy).toHaveBeenCalledTimes(1)
    expect(mockSaveStep).toHaveBeenCalledWith(IdentityCheckStep.PROFILE)
    expect(navigate).not.toHaveBeenCalled()
    expect(postHonorStatementSpy).not.toHaveBeenCalled()
  })

  it('should submit the Educonnect profile before advancing to the stepper without posting honor', async () => {
    mockIdentityCheckMethod = 'educonnect'
    let resolveProfile: () => void = () => undefined
    postProfileSpy.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveProfile = () => resolve({})
      })
    )
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(postProfileSpy).toHaveBeenCalledTimes(1))

    expect(mockNavigateForwardToStepper).not.toHaveBeenCalled()
    expect(mockSaveStep).not.toHaveBeenCalled()
    expect(mockRefetchUser).not.toHaveBeenCalled()
    expect(postHonorStatementSpy).not.toHaveBeenCalled()

    resolveProfile()

    await waitFor(() => expect(mockNavigateForwardToStepper).toHaveBeenCalledTimes(1))

    expect(mockSaveStep).toHaveBeenCalledWith(IdentityCheckStep.PROFILE)
    expect(mockRefetchUser).toHaveBeenCalledWith()
    expect(postHonorStatementSpy).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('should not advance the Educonnect stepper when profile submission fails', async () => {
    mockIdentityCheckMethod = 'educonnect'
    postProfileSpy.mockRejectedValueOnce(new Error('Profile submission failed'))
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(showErrorSnackBarSpy).toHaveBeenCalledTimes(1))

    expect(mockNavigateForwardToStepper).not.toHaveBeenCalled()
    expect(mockSaveStep).not.toHaveBeenCalled()
    expect(postHonorStatementSpy).not.toHaveBeenCalled()
    expect(mockRefetchUser).not.toHaveBeenCalled()
  })

  it('should wait for the backend profile before confirming the eighteen credit', async () => {
    let resolveRefetch: (value: { data: typeof beneficiaryUser; isError: boolean }) => void = () =>
      undefined
    mockRefetchUser.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRefetch = resolve
      })
    )
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(mockRefetchUser).toHaveBeenCalledWith())

    expect(navigate).not.toHaveBeenCalled()

    resolveRefetch({ data: beneficiaryUser, isError: false })

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        screen: 'BeneficiaryAccountCreated',
        params: { from: 'CheckAddress' },
      })
    )
  })

  it.each([
    ['seventeen credit', { ...beneficiaryUser, creditType: UserCreditType.CREDIT_V3_17 }],
    ['no credit', nonBeneficiaryUser],
    ['exhausted credit', { ...beneficiaryUser, creditType: UserCreditType.CREDIT_EMPTY }],
    ['expired credit', { ...beneficiaryUser, depositExpirationDate: '2020-01-01T00:00:00Z' }],
    ['non-beneficiary profile', { ...beneficiaryUser, statusType: nonBeneficiaryUser.statusType }],
  ])('should show the pending request when the backend returns %s', async (_label, profile) => {
    mockRefetchUser.mockResolvedValueOnce({ data: profile, isError: false })
    renderCheckAddress()

    await validateAddress()

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        screen: 'BeneficiaryRequestSent',
        params: undefined,
      })
    )

    expect(mockSaveStep).toHaveBeenCalledWith(IdentityCheckStep.CONFIRMATION)
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it.each(['rejected', 'error result', 'missing profile'])(
    'should report a %s refetch without navigating',
    async (failure) => {
      if (failure === 'rejected') {
        mockRefetchUser.mockRejectedValueOnce(new Error('Refetch failed'))
      } else {
        mockRefetchUser.mockResolvedValueOnce({
          isError: failure === 'error result',
          error: new Error('Refetch failed'),
          data: failure === 'error result' ? beneficiaryUser : undefined,
        })
      }
      renderCheckAddress()

      await validateAddress()

      await waitFor(() => expect(showErrorSnackBarSpy).toHaveBeenCalledTimes(1))

      expect(navigate).not.toHaveBeenCalled()
      expect(mockSaveStep).not.toHaveBeenCalledWith(IdentityCheckStep.CONFIRMATION)
      expect(screen.getByText('Valider mon adresse')).toBeEnabled()
    }
  )

  it('should display an error and allow retrying when patching the address fails', async () => {
    patchProfileSpy.mockRejectedValueOnce(new Error('Profile update failed'))
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(showErrorSnackBarSpy).toHaveBeenCalledTimes(1))

    expect(navigate).not.toHaveBeenCalled()
    expect(mockSaveStep).not.toHaveBeenCalled()
    expect(screen.getByText('Valider mon adresse')).toBeEnabled()

    await user.press(screen.getByText('Valider mon adresse'))

    await waitFor(() => expect(navigate).toHaveBeenCalledTimes(1))

    expect(patchProfileSpy).toHaveBeenCalledTimes(2)
  })

  it('should report missing profile information without navigating or calling the API', async () => {
    mockAuthContextWithUser({ ...beneficiaryUser, street: null }, { persist: true })
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(showErrorSnackBarSpy).toHaveBeenCalledTimes(1))

    expect(postProfileSpy).not.toHaveBeenCalled()
    expect(patchProfileSpy).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('should display an error without saving the profile when the user is missing', async () => {
    mockAuthContextWithoutUser({ persist: true, refetchUser: mockRefetchUser })
    renderCheckAddress()

    await validateAddress()

    expect(showErrorSnackBarSpy).toHaveBeenCalledWith(
      'Une erreur est survenue lors de la mise à jour de ton profil'
    )
    expect(patchProfileSpy).not.toHaveBeenCalled()
    expect(postProfileSpy).not.toHaveBeenCalled()
    expect(postHonorStatementSpy).not.toHaveBeenCalled()
    expect(mockSaveStep).not.toHaveBeenCalled()
    expect(mockRefetchUser).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
    expect(mockNavigateForwardToStepper).not.toHaveBeenCalled()
  })

  it('should reject incomplete subscription profiles without sending requests', async () => {
    mockAuthContextWithUser(
      { ...beneficiaryUser, firstName: null, lastName: null, activityId: null },
      { persist: true, refetchUser: mockRefetchUser }
    )
    renderCheckAddress()

    await validateAddress()

    expect(showErrorSnackBarSpy).toHaveBeenCalledWith(
      'Une erreur est survenue lors de la mise à jour de ton profil'
    )
    expect(patchProfileSpy).not.toHaveBeenCalled()
    expect(postProfileSpy).not.toHaveBeenCalled()
  })

  it('should wait for profile submission before posting honor and checking the credit', async () => {
    let resolveProfile: () => void = () => undefined
    postProfileSpy.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveProfile = () => resolve({})
      })
    )
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(postProfileSpy).toHaveBeenCalledTimes(1))

    expect(mockRefetchUser).not.toHaveBeenCalled()
    expect(postHonorStatementSpy).not.toHaveBeenCalled()
    expect(screen.getByText('Modifier mon adresse')).toBeDisabled()

    resolveProfile()

    await waitFor(() => expect(mockRefetchUser).toHaveBeenCalledWith())

    expect(postHonorStatementSpy).toHaveBeenCalledTimes(1)
  })

  it.each(['dms', 'ubble'])(
    'should wait for honor success before refetching the user for %s',
    async (method) => {
      mockIdentityCheckMethod = method
      let resolveHonor: () => void = () => undefined
      postHonorStatementSpy.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveHonor = () => resolve({})
        })
      )
      renderCheckAddress()

      await validateAddress()

      await waitFor(() => expect(postHonorStatementSpy).toHaveBeenCalledTimes(1))

      expect(postProfileSpy).toHaveBeenCalledTimes(1)
      expect(mockRefetchUser).not.toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
      expect(screen.getByText('Modifier mon adresse')).toBeDisabled()

      resolveHonor()

      await waitFor(() => expect(mockRefetchUser).toHaveBeenCalledWith())
    }
  )

  it('should report honor failure without refetching or navigating and allow retrying', async () => {
    postHonorStatementSpy.mockRejectedValueOnce(new Error('Honor statement failed'))
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(showErrorSnackBarSpy).toHaveBeenCalledTimes(1))

    expect(mockRefetchUser).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
    expect(screen.getByText('Valider mon adresse')).toBeEnabled()

    await user.press(screen.getByText('Valider mon adresse'))

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        screen: 'BeneficiaryAccountCreated',
        params: { from: 'CheckAddress' },
      })
    )

    expect(postHonorStatementSpy).toHaveBeenCalledTimes(2)
  })

  it('should stop when submitting the subscription profile fails', async () => {
    postProfileSpy.mockRejectedValueOnce(new Error('Subscription profile failed'))
    renderCheckAddress()

    await validateAddress()

    await waitFor(() => expect(showErrorSnackBarSpy).toHaveBeenCalledTimes(1))

    expect(mockRefetchUser).not.toHaveBeenCalled()
    expect(postHonorStatementSpy).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
    expect(screen.getByText('Valider mon adresse')).toBeEnabled()
  })
})

const renderCheckAddress = () => render(reactQueryProviderHOC(<CheckAddress />))

const validateAddress = async () => {
  const checkbox = screen.queryByRole('checkbox')
  if (checkbox) await user.press(checkbox)
  await user.press(screen.getByText('Valider mon adresse'))
}
