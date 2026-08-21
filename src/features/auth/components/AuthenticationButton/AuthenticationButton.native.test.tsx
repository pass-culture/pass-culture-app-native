import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import { Provider } from 'features/auth/types'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

const NAV_PARAMS_LOGIN = { offerId: 1 }
const NAV_PARAMS_SIGNUP = { offerId: 1, from: StepperOrigin.HOME }

const user = userEvent.setup()
jest.useFakeTimers()

jest.mock('features/navigation/helpers/openUrl')
jest.mock('features/auth/helpers/getLastLoginInfo')

describe('<AuthenticationButton />', () => {
  beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_SAVE_LAST_LOGIN_INFO]))

  it('should navigate to the LoginMethods page when there is no last login info', async () => {
    jest.mocked(getLastLoginInfo).mockResolvedValueOnce(null)

    render(reactQueryProviderHOC(<AuthenticationButton type="login" />))

    const connectButton = await screen.findByText('Se connecter')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('LoginMethods', {})
  })

  it('should navigate to the LoginMethodsWithLastLoginInfo page when last login info exists', async () => {
    jest.mocked(getLastLoginInfo).mockResolvedValueOnce({
      maskedEmail: 'rog*************@gmail.com',
      provider: { label: 'E-mail', icon: EmailFilled, type: Provider.EMAIL },
      lastLoginAt: '18/08/2026',
    })

    render(reactQueryProviderHOC(<AuthenticationButton type="login" />))

    const connectButton = await screen.findByText('Se connecter')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('LoginMethodsWithLastLoginInfo', {})
  })

  it('should navigate to the SignupMethods page when is type signup', async () => {
    render(reactQueryProviderHOC(<AuthenticationButton type="signup" />))

    const connectButton = screen.getByText('Créer un compte')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('SignupMethods', {})
    expect(getLastLoginInfo).not.toHaveBeenCalled()
  })

  it('should navigate to the LoginMethods page with additional params when there is no last login info', async () => {
    jest.mocked(getLastLoginInfo).mockResolvedValueOnce(null)

    render(reactQueryProviderHOC(<AuthenticationButton type="login" params={NAV_PARAMS_LOGIN} />))

    const connectButton = await screen.findByText('Se connecter')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('LoginMethods', NAV_PARAMS_LOGIN)
  })

  it('should navigate to the LoginMethodsWithLastLoginInfo page with additional params when last login info exists', async () => {
    jest.mocked(getLastLoginInfo).mockResolvedValueOnce({
      maskedEmail: 'rog*************@gmail.com',
      provider: { label: 'E-mail', icon: EmailFilled, type: Provider.EMAIL },
      lastLoginAt: '18/08/2026',
    })

    render(reactQueryProviderHOC(<AuthenticationButton type="login" params={NAV_PARAMS_LOGIN} />))

    const connectButton = await screen.findByText('Se connecter')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('LoginMethodsWithLastLoginInfo', NAV_PARAMS_LOGIN)
  })

  it('should navigate to the SignupMethods page with additional params when is type signup', async () => {
    render(reactQueryProviderHOC(<AuthenticationButton type="signup" params={NAV_PARAMS_SIGNUP} />))

    const connectButton = screen.getByText('Créer un compte')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('SignupMethods', NAV_PARAMS_SIGNUP)
    expect(getLastLoginInfo).not.toHaveBeenCalled()
  })
})
