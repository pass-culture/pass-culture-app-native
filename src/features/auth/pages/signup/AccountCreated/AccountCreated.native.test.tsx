import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BatchUser } from 'libs/react-native-batch'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { AccountCreated } from './AccountCreated'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/profile/api/useResetRecreditAmountToShow')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/AuthContext')

const mockShowAppModal = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<AccountCreated />', () => {
  beforeEach(() => {
    activateFeatureFlags()
  })

  it('should render correctly', async () => {
    renderAccountCreated()

    await screen.findByText('Ton compte a été activé !')

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to native cultural survey page WHEN "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    await waitFor(() => {
      expect(navigateFromRef).not.toHaveBeenCalled()
      expect(navigate).toHaveBeenNthCalledWith(1, 'CulturalSurveyIntro', undefined)
    })
  })

  it('should redirect to home page WHEN "On y va !" button is clicked BUT feature flag enableCulturalSurveyMandatory is enabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    await waitFor(() => {
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(navigate).not.toHaveBeenCalledWith('CulturalSurvey', undefined)
    })
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    mockAuthContextWithUser({ ...beneficiaryUser, needsToFillCulturalSurvey: false })
    mockAuthContextWithUser({ ...beneficiaryUser, needsToFillCulturalSurvey: false }) // re-render because local storage value has been read and set
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    await waitFor(() => {
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(navigate).not.toHaveBeenCalledWith('CulturalSurvey', undefined)
    })
  })

  it('should track Batch event when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_validated_account')
  })

  it('should show non eligible share app modal when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.NOT_ELIGIBLE)
  })

  it('should log analytics when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(analytics.logAccountCreatedStartClicked).toHaveBeenCalledTimes(1)
  })
})

const renderAccountCreated = () =>
  render(<AccountCreated />, {
    wrapper: ShareAppWrapper,
  })

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
