import { format } from 'date-fns'
import mockdate from 'mockdate'

import { replace } from '__mocks__/@react-navigation/native'
import { EligibilityType, UserProfileResponse } from 'api/gen'
import { CURRENT_DATE, SIXTEEN_AGE_DATE } from 'features/auth/fixtures/fixtures'
import * as Login from 'features/auth/helpers/useLoginRoutine'
import { useLoginAndRedirect } from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { nonBeneficiaryUser } from 'fixtures/user'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
// eslint-disable-next-line no-restricted-imports
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.useFakeTimers()

mockdate.set(CURRENT_DATE)

jest.mock('libs/campaign')
jest.mock('features/auth/helpers/useLoginRoutine')
const loginRoutine = jest.fn()
const mockUseLoginRoutine = Login.useLoginRoutine as jest.Mock

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))
jest.mock('libs/jwt/jwt')

jest.mock('libs/firebase/analytics/analytics')

describe('useLoginAndRedirect', () => {
  beforeEach(() => setFeatureFlags())

  afterEach(jest.runOnlyPendingTimers)

  it('should login user', async () => {
    mockUseLoginRoutine.mockReturnValueOnce(loginRoutine)
    mockServer.getApi<UserProfileResponse>('/v1/me', nonBeneficiaryUser)

    await loginAndRedirect()

    expect(loginRoutine).toHaveBeenCalledTimes(1)
  })

  it('should redirect to DisableActivation when disableActivation is true', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.DISABLE_ACTIVATION])
    mockServer.getApi<UserProfileResponse>('/v1/me', nonBeneficiaryUser)
    await loginAndRedirect()

    jest.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'DisableActivation',
    })
  })

  it('should redirect to AccountCreated when isEligibleForBeneficiaryUpgrade is false', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      eligibility: EligibilityType['age-18'],
      isEligibleForBeneficiaryUpgrade: false,
    })

    await loginAndRedirect()

    jest.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('AccountCreated')
  })

  it('should redirect to AccountCreated when isEligibleForBeneficiaryUpgrade and user is 15 or 16 yo', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      eligibility: EligibilityType['free'],
      isEligibleForBeneficiaryUpgrade: true,
    })

    await loginAndRedirect()

    jest.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('AccountCreated')
  })

  it('should redirect to Verify Eligibility when isEligibleForBeneficiaryUpgrade and user is 17 or 18 yo', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      eligibility: EligibilityType['age-17-18'],
      isEligibleForBeneficiaryUpgrade: true,
    })

    await loginAndRedirect()

    jest.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('VerifyEligibility')
  })

  it('should redirect to AccountCreated when not isEligibleForBeneficiaryUpgrade and user is not future eligible', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      isEligibleForBeneficiaryUpgrade: false,
      eligibilityStartDatetime: '2019-12-01T00:00:00Z',
    })
    await loginAndRedirect()

    jest.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledWith('AccountCreated')
  })

  it('should redirect to NotYetUnderageEligibility when not isEligibleForBeneficiaryUpgrade and user is future eligible', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      ...nonBeneficiaryUser,
      email: 'email@domain.ext',
      firstName: 'Jean',
      isEligibleForBeneficiaryUpgrade: false,
      eligibilityStartDatetime: '2021-12-01T00:00:00Z',
    })
    await loginAndRedirect()

    jest.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledWith('NotYetUnderageEligibility', {
      eligibilityStartDatetime: '2021-12-01T00:00:00Z',
    })
  })

  it('should redirect to AccountCreated on error', async () => {
    mockServer.getApi<UserProfileResponse>('/v1/me', {
      responseOptions: { statusCode: 404 },
    })
    await loginAndRedirect()

    jest.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledWith('AccountCreated')
  })

  describe('AppsFlyer events', () => {
    it('should log event when account creation is completed', async () => {
      mockServer.getApi<UserProfileResponse>('/v1/me', nonBeneficiaryUser)
      await loginAndRedirect()

      expect(campaignTracker.logEvent).toHaveBeenNthCalledWith(
        1,
        CampaignEvents.COMPLETE_REGISTRATION,
        {
          af_firebase_pseudo_id: 'firebase_pseudo_id',
          af_user_id: nonBeneficiaryUser.id,
        }
      )
    })

    it('should log af_underage_user event when user is underage', async () => {
      mockServer.getApi<UserProfileResponse>('/v1/me', {
        ...nonBeneficiaryUser,
        birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd'),
      })
      await loginAndRedirect()

      expect(campaignTracker.logEvent).toHaveBeenNthCalledWith(2, CampaignEvents.UNDERAGE_USER, {
        af_firebase_pseudo_id: 'firebase_pseudo_id',
        af_user_id: nonBeneficiaryUser.id,
        af_user_age: 16,
      })
    })

    it('should not log af_underage_user event when user is not underage', async () => {
      mockServer.getApi<UserProfileResponse>('/v1/me', {
        ...nonBeneficiaryUser,
        birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd'),
      })
      await loginAndRedirect()

      expect(campaignTracker.logEvent).not.toHaveBeenCalledWith(CampaignEvents.UNDERAGE_USER)
    })
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
