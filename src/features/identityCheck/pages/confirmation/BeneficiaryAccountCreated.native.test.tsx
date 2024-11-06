import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { beneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BatchUser } from 'libs/react-native-batch'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/auth/context/AuthContext')

const mockShowAppModal = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<BeneficiaryAccountCreated/>', () => {
  beforeEach(() => {
    activateFeatureFlags()
    mockAuthContextWithUser(underageBeneficiaryUser, { persist: true })
  })

  it('should render correctly for underage beneficiaries', async () => {
    renderBeneficiaryAccountCreated()

    await screen.findByLabelText('C’est parti !')

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly for 18 year-old beneficiaries', async () => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    renderBeneficiaryAccountCreated()

    await screen.findByLabelText('C’est parti !')

    expect(screen).toMatchSnapshot()
  })

  it('should track Batch event when button is clicked', async () => {
    renderBeneficiaryAccountCreated()
    fireEvent.press(await screen.findByLabelText('C’est parti !'))

    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_validated_subscription')
  })

  it('should show beneficiary share app modal when button is clicked', async () => {
    // Too many rerenders but we reset the values before each tests
    // eslint-disable-next-line local-rules/independent-mocks
    mockAuthContextWithUser(
      { ...beneficiaryUser, needsToFillCulturalSurvey: false },
      { persist: true }
    )
    renderBeneficiaryAccountCreated()

    fireEvent.press(await screen.findByLabelText('C’est parti !'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })

  it('should not show share app modal when user is supposed to see cultural survey', async () => {
    renderBeneficiaryAccountCreated()
    fireEvent.press(await screen.findByLabelText('C’est parti !'))

    expect(mockShowAppModal).not.toHaveBeenCalled()
  })

  it('should redirect to native cultural survey page when "C’est parti !"button is clicked and user is supposed to see cultural survey', async () => {
    renderBeneficiaryAccountCreated()
    mockAuthContextWithUser(
      { ...beneficiaryUser, needsToFillCulturalSurvey: true },
      { persist: true }
    )
    fireEvent.press(await screen.findByLabelText('C’est parti !'))
    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'CulturalSurveyIntro', undefined)
    })
  })

  it('should redirect to home page when "C’est parti !" button is clicked BUT feature flag enableCulturalSurveyMandatory is enabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    renderBeneficiaryAccountCreated()
    fireEvent.press(await screen.findByLabelText('C’est parti !'))
    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'TabNavigator', { screen: 'Home' })
    })
  })
})

const renderBeneficiaryAccountCreated = () =>
  render(<BeneficiaryAccountCreated />, { wrapper: ShareAppWrapper })
const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
