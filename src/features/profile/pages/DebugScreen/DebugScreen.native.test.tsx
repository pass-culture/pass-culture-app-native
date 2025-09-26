import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

import { DebugScreen } from './DebugScreen'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => ({ user: { id: '1234' } }),
}))

jest.mock('features/trustedDevice/helpers/useDeviceInfo', () => ({
  useDeviceInfo: () => ({
    deviceId: 'device-id',
    os: 'iOS',
    resolution: '1080x1920',
    source: 'iPhone 13',
    screenZoomLevel: undefined,
    fontScale: 1.5,
  }),
}))

jest.mock('ui/hooks/useVersion', () => ({
  useVersion: () => '1.2.3',
}))

jest.mock('libs/environment/env', () => ({
  env: { COMMIT_HASH: 'abcdef', SUPPORT_EMAIL_ADDRESS: 'support@example.com' },
}))

const mockCopyToClipboard = jest.fn()
jest.mock('libs/useCopyToClipboard/useCopyToClipboard', () => ({
  useCopyToClipboard: ({ onCopy }) => {
    onCopy?.()
    return mockCopyToClipboard
  },
}))

jest.useFakeTimers()

describe('DebugScreen', () => {
  it('should render correctly', () => {
    render(<DebugScreen />)

    expect(screen).toMatchSnapshot()
  })

  it('should call copyToClipboard when press "Copier dans le presse-papier" button', async () => {
    render(<DebugScreen />)
    await enterDescription()
    const copyButton = screen.getByText('Copier dans le presse-papier')
    await userEvent.press(copyButton)

    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1)
  })

  it('should contain the correct informations when press "Contacter le support" button', async () => {
    render(<DebugScreen />)
    await enterDescription()

    const supportButton = screen.getByText('Contacter le support')
    await userEvent.press(supportButton)

    const decodedUrl = decodeURI(openUrl.mock.calls[0]?.[0] as string)

    expect(decodedUrl).toContain('mailto:support@example.com?subject=Informations de débuggage')
    expect(decodedUrl).toContain('Bonjour, voici les informations de débuggage')
    expect(decodedUrl).toContain('App version : 1.2.3')
    expect(decodedUrl).toContain('Device ID : device-id')
    expect(decodedUrl).toContain('Device model : iPhone 13')
    expect(decodedUrl).toContain('Device OS : iOS')
    expect(decodedUrl).toContain('Device resolution : 1080x1920')
    expect(decodedUrl).toContain('User ID : 1234')
    expect(decodedUrl).toContain('Device font scale : 1.5')
    expect(decodedUrl).toContain('Device zoom : Non renseigné')
    expect(decodedUrl).toContain("J'ai un problème avec la carte")
  })

  it('should log ClickCopyDebugInfo event when press "Copier dans le press-papier" button', async () => {
    render(<DebugScreen />)
    await enterDescription()

    const copyButton = screen.getByText('Copier dans le presse-papier')
    await userEvent.press(copyButton)

    expect(analytics.logClickCopyDebugInfo).toHaveBeenNthCalledWith(1, '1234')
  })

  it('should log ClickMailDebugInfo event when press "Contacter le support" button', async () => {
    render(<DebugScreen />)
    await enterDescription()

    const copyButton = screen.getByText('Contacter le support')
    await userEvent.press(copyButton)

    expect(analytics.logClickMailDebugInfo).toHaveBeenNthCalledWith(1, '1234')
  })
})

const enterDescription = async () => {
  const textBox = screen.getByPlaceholderText('Décrire en quelques phrases.')
  await act(async () => {
    fireEvent.changeText(textBox, "J'ai un problème avec la carte")
  })
}
