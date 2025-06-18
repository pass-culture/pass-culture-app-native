import React from 'react'

import { BatchEvent, BatchProfile } from '__mocks__/@batch.com/react-native-plugin'
import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

import { AccountCreated } from './AccountCreated'

jest.mock('libs/firebase/analytics/analytics')

jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery').mockReturnValue(DEFAULT_REMOTE_CONFIG)

jest.mock('queries/profile/useResetRecreditAmountToShowMutation')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/AuthContext')

const mockShowAppModal = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<AccountCreated />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', async () => {
    renderAccountCreated()

    await screen.findByText('Ton compte a été activé !')

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to native cultural survey page WHEN "On y va !" button is clicked', async () => {
    renderAccountCreated()

    await user.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(navigateFromRef).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenNthCalledWith(1, 'CulturalSurveyIntro', undefined)
  })

  it('should redirect to home page WHEN "On y va !" button is clicked BUT feature flag enableCulturalSurveyMandatory is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    renderAccountCreated()

    await user.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
    expect(navigate).not.toHaveBeenCalledWith('CulturalSurvey', undefined)
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    mockAuthContextWithUser({ ...beneficiaryUser, needsToFillCulturalSurvey: false })
    mockAuthContextWithUser({ ...beneficiaryUser, needsToFillCulturalSurvey: false }) // re-render because local storage value has been read and set
    renderAccountCreated()

    await user.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
    expect(navigate).not.toHaveBeenCalledWith('CulturalSurvey', undefined)
  })

  it('should track Batch event when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    await user.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(BatchProfile.trackEvent).toHaveBeenCalledWith('has_validated_account')
  })

  it('should track Batch event when the screen is mounted', async () => {
    renderAccountCreated()

    await screen.findByText('Ton compte a été activé !')

    expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.screenViewAccountCreated)
  })

  it('should show non eligible share app modal when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    await user.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.NOT_ELIGIBLE)
  })
})

const renderAccountCreated = () =>
  render(<AccountCreated />, {
    wrapper: ShareAppWrapper,
  })
