import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import * as copyToClipboardModule from 'libs/copyToClipboard/copyToClipboard'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

import { DebugScreen } from './DebugScreen'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/context/AuthContext')

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

const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')
const mockCopyToClipboard = jest.spyOn(copyToClipboardModule, 'copyToClipboard')

jest.useFakeTimers()

describe('DebugScreen', () => {
  mockAuthContextWithUser(beneficiaryUser)

  it('should render correctly', () => {
    render(<DebugScreen />)

    expect(screen).toMatchSnapshot()
  })

  it('should open Zendesk url when clicking on "Envoyer mon bug au support" button', async () => {
    render(<DebugScreen />)
    await enterDescription()
    const copyButton = screen.getByText('Envoyer mon bug au support')
    await userEvent.press(copyButton)

    expect(mockOpenUrl).toHaveBeenCalledWith(
      expect.stringContaining('https://aide.passculture.app/hc/fr/requests/new'),
      undefined,
      true
    )
  })

  it('should call copyToClipboard when press "Copier dans le presse-papier" button', async () => {
    render(<DebugScreen />)
    await enterDescription()
    const copyButton = screen.getByLabelText('Copier dans le presse-papier')
    await userEvent.press(copyButton)

    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1)
  })

  it('should log ClickCopyDebugInfo event when press "Copier dans le press-papier" button', async () => {
    render(<DebugScreen />)
    await enterDescription()

    const copyButton = screen.getByLabelText('Copier dans le presse-papier')
    await userEvent.press(copyButton)

    await waitFor(() => {
      expect(analytics.logClickCopyDebugInfo).toHaveBeenNthCalledWith(1, 1234)
    })
  })

  it('should log ClickMailDebugInfo event when press "Envoyer mon bug au support" button', async () => {
    render(<DebugScreen />)
    await enterDescription()

    const copyButton = screen.getByText('Envoyer mon bug au support')
    await userEvent.press(copyButton)

    expect(analytics.logClickMailDebugInfo).toHaveBeenNthCalledWith(1, 1234)
  })

  it('should log HasClickedContactForm event when press "Contacter le support" button', async () => {
    render(<DebugScreen />)

    const contactSupportButton = screen.getByText('Contacter le support')

    await userEvent.press(contactSupportButton)

    expect(analytics.logHasClickedContactForm).toHaveBeenNthCalledWith(1, 'DebugScreen')
  })
})

const enterDescription = async () => {
  const textBox = screen.getByTestId('problem-description-input')
  await act(async () => {
    fireEvent.changeText(textBox, "J'ai un problème avec la carte")
  })
}
