import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as SettingsContextAPI from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { beneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BatchProfile } from 'libs/react-native-batch'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { userEvent, render, screen, act } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

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

describe('<BeneficiaryAccountCreated/>', () => {
  beforeEach(() => {
    setFeatureFlags()
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
    await user.press(await screen.findByLabelText('C’est parti !'))

    expect(BatchProfile.trackEvent).toHaveBeenCalledWith('has_validated_subscription')
  })

  it('should show beneficiary share app modal when button is clicked', async () => {
    // Too many rerenders but we reset the values before each tests
    // eslint-disable-next-line local-rules/independent-mocks
    mockAuthContextWithUser(
      { ...beneficiaryUser, needsToFillCulturalSurvey: false },
      { persist: true }
    )
    renderBeneficiaryAccountCreated()

    await user.press(await screen.findByLabelText('C’est parti !'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })

  it('should not show share app modal when user is supposed to see cultural survey', async () => {
    renderBeneficiaryAccountCreated()

    await user.press(await screen.findByLabelText('C’est parti !'))

    expect(mockShowAppModal).not.toHaveBeenCalled()
  })

  it('should redirect to native cultural survey page when "C’est parti !"button is clicked and user is supposed to see cultural survey', async () => {
    renderBeneficiaryAccountCreated()
    mockAuthContextWithUser(
      { ...beneficiaryUser, needsToFillCulturalSurvey: true },
      { persist: true }
    )

    await user.press(await screen.findByLabelText('C’est parti !'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'CulturalSurveyIntro', undefined)
  })

  it('should redirect to home page when "C’est parti !" button is clicked BUT feature flag enableCulturalSurveyMandatory is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    renderBeneficiaryAccountCreated()

    await user.press(await screen.findByLabelText('C’est parti !'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'TabNavigator', { screen: 'Home' })
  })

  it('should have correct credit information text for beneficiary user', async () => {
    mockAuthContextWithUser({ ...beneficiaryUser }, { persist: true })
    renderBeneficiaryAccountCreated()

    const recreditText = screen.getByText('Tu as deux ans pour profiter de ton crédit.')

    await act(() => {
      expect(recreditText).toBeOnTheScreen()
    })
  })

  it('should have correct credit information text for underage beneficiary', async () => {
    renderBeneficiaryAccountCreated()

    const recreditText = screen.getByText(
      'Tu as jusqu’à la veille de tes 18 ans pour profiter de ton crédit.'
    )

    await act(() => {
      expect(recreditText).toBeOnTheScreen()
    })
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      jest.spyOn(SettingsContextAPI, 'useSettingsContext').mockReturnValue({
        data: { ...defaultSettings, wipEnableCreditV3: true },
        isLoading: false,
      })
    })

    it('should have correct credit information text', async () => {
      renderBeneficiaryAccountCreated()

      const recreditText = screen.getByText(
        'Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.'
      )

      await act(() => {
        expect(recreditText).toBeOnTheScreen()
      })
    })
  })
})

const renderBeneficiaryAccountCreated = () =>
  render(<BeneficiaryAccountCreated />, { wrapper: ShareAppWrapper })
