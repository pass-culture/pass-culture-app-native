import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentificationFork } from 'features/identityCheck/pages/identification/IdentificationFork'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

useRemoteConfigContextSpy.mockReturnValue({
  ...DEFAULT_REMOTE_CONFIG,
  shouldDisplayReassuranceMention: true,
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<IdentificationFork />', () => {
  it('should render correctly', () => {
    render(<IdentificationFork />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next screen "SelectIDOrigin" on press "Ma pièce d’identité"', async () => {
    render(<IdentificationFork />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SelectIDOrigin', undefined)
    })
  })

  it('should navigate to next screen "EduConnectForm" on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationFork />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('EduConnectForm', undefined)
    })
  })

  it('should log analytics on press "Ma pièce d’identité"', async () => {
    render(<IdentificationFork />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logChooseUbbleMethod).toHaveBeenCalledTimes(1)
    })
  })

  it('should log analytics on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationFork />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logChooseEduConnectMethod).toHaveBeenCalledTimes(1)
    })
  })

  it('should open data privacy chart when pressing link', () => {
    render(<IdentificationFork />)

    const externalLink = screen.getByText('Voir la charte des données personnelles')

    fireEvent.press(externalLink)

    expect(openUrl).toHaveBeenCalledWith('https://passculture.privacy', undefined, true)
  })

  it('should not display reassuring mention when firebase parameters is false', () => {
    useRemoteConfigContextSpy.mockReturnValueOnce({
      ...DEFAULT_REMOTE_CONFIG,
      shouldDisplayReassuranceMention: false,
    })

    render(<IdentificationFork />)

    expect(
      screen.queryByText('pass Culture collecte tes données personnelles')
    ).not.toBeOnTheScreen()
  })
})
