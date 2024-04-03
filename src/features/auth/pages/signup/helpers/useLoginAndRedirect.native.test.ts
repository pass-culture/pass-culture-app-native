import mockdate from 'mockdate'

import { replace } from '__mocks__/@react-navigation/native'
import { EligibilityType, UserProfileResponse } from 'api/gen'
import * as Login from 'features/auth/helpers/useLoginRoutine'
import { useLoginAndRedirect } from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { nonBeneficiaryUser } from 'fixtures/user'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
// eslint-disable-next-line no-restricted-imports
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.useFakeTimers()

mockdate.set(new Date('2020-12-01T00:00:00Z'))

jest.mock('features/auth/helpers/useLoginRoutine')
const loginRoutine = jest.fn()
const mockUseLoginRoutine = Login.useLoginRoutine as jest.Mock

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

describe('useLoginAndRedirect', () => {
  afterEach(jest.runOnlyPendingTimers)

  it('should login user', async () => {
    mockUseLoginRoutine.mockReturnValueOnce(loginRoutine)
    mockServer.getApi<UserProfileResponse>('/v1/me', nonBeneficiaryUser)

    loginAndRedirect()

    expect(loginRoutine).toHaveBeenCalledTimes(1)
  })

  it('should redirect to AccountCreated when isEligibleForBeneficiaryUpgrade is false', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      eligibility: EligibilityType['age-18'],
      isEligibleForBeneficiaryUpgrade: false,
    })

    loginAndRedirect()

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledWith('AccountCreated')
      },
      { timeout: 10_000 }
    )
  })

  it('should redirect to Verify Eligibility when isEligibleForBeneficiaryUpgrade and user is 18 yo', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      eligibility: EligibilityType['age-18'],
      isEligibleForBeneficiaryUpgrade: true,
    })

    loginAndRedirect()

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledWith('VerifyEligibility')
      },
      { timeout: 10_000 }
    )
  })

  it('should redirect to AccountCreated when not isEligibleForBeneficiaryUpgrade and user is not future eligible', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      isEligibleForBeneficiaryUpgrade: false,
      eligibilityStartDatetime: '2019-12-01T00:00:00Z',
    })
    loginAndRedirect()

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('AccountCreated')
      },
      { timeout: 10_000 }
    )
  })

  it('should log event when account creation is completed', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      isEligibleForBeneficiaryUpgrade: false,
      eligibilityStartDatetime: '2019-12-01T00:00:00Z',
    })
    loginAndRedirect()

    await waitFor(() => {
      expect(campaignTracker.logEvent).toHaveBeenNthCalledWith(
        1,
        CampaignEvents.COMPLETE_REGISTRATION,
        {
          af_firebase_pseudo_id: 'firebase_pseudo_id',
          af_user_id: nonBeneficiaryUser.id,
        }
      )
    })
  })

  it('should redirect to NotYetUnderageEligibility when not isEligibleForBeneficiaryUpgrade and user is future eligible', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      isEligibleForBeneficiaryUpgrade: false,
      eligibilityStartDatetime: '2021-12-01T00:00:00Z',
    })
    loginAndRedirect()

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('NotYetUnderageEligibility', {
          eligibilityStartDatetime: '2021-12-01T00:00:00Z',
        })
      },
      { timeout: 10_000 }
    )
  })

  it('should redirect to AccountCreated on error', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      responseOptions: { statusCode: 404 },
    })
    loginAndRedirect()

    await waitFor(
      () => {
        expect(replace).toHaveBeenCalledWith('AccountCreated')
      },
      { timeout: 10_000 }
    )
  })
})

const renderUseLoginAndRedirect = () =>
  renderHook(useLoginAndRedirect, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

const loginAndRedirect = async () => {
  const { result } = renderUseLoginAndRedirect()
  return result.current({ accessToken: 'accessToken', refreshToken: 'refreshToken' })
}
