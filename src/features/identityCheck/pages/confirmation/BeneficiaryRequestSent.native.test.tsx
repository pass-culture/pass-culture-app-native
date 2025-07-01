/* eslint-disable local-rules/independent-mocks */
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

import { BeneficiaryRequestSent } from './BeneficiaryRequestSent'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.mock('features/auth/context/AuthContext')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<BeneficiaryRequestSent />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', async () => {
    render(<BeneficiaryRequestSent />)

    await screen.findByLabelText('On y va\u00a0!')

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page when "On y va !" button is clicked', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    render(<BeneficiaryRequestSent />)

    await user.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
    expect(navigate).not.toHaveBeenCalled()
  })
})
