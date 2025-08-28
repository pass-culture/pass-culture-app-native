import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { beneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { BatchProfile } from 'libs/react-native-batch'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

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
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    renderBeneficiaryAccountCreated()

    await user.press(await screen.findByLabelText('C’est parti !'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })

  it('should redirect to home page when "C’est parti !" button is clicked BUT feature flag enableCulturalSurveyMandatory is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    renderBeneficiaryAccountCreated()

    await user.press(await screen.findByLabelText('C’est parti !'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'TabNavigator', { screen: 'Home' })
  })

  it('should have correct amount for underage users', async () => {
    renderBeneficiaryAccountCreated()

    const recreditAmount = screen.getByText('50 €')

    await act(() => {
      expect(recreditAmount).toBeOnTheScreen()
    })
  })

  it('should have correct amount for 18 year old users', async () => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    renderBeneficiaryAccountCreated()

    const recreditAmount = screen.getByText('150 €')

    await act(() => {
      expect(recreditAmount).toBeOnTheScreen()
    })
  })
})

function renderBeneficiaryAccountCreated() {
  return render(<BeneficiaryAccountCreated />, {
    wrapper: (props) =>
      reactQueryProviderHOC(
        <ShareAppWrapper>
          <React.Fragment>{props.children}</React.Fragment>
        </ShareAppWrapper>
      ),
  })
}
