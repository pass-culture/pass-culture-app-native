import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectIDStatus } from 'features/identityCheck/pages/identification/ubble/SelectIDStatus'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('SelectIDStatus', () => {
  it('should render SelectIDStatus page correctly', () => {
    render(<SelectIDStatus />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to ubble webview when pressing "J’ai ma pièce d’identité en cours de validité" button', async () => {
    render(<SelectIDStatus />)

    const button = screen.getByText('J’ai ma pièce d’identité en cours de validité')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('UbbleWebview', undefined)
    })
  })

  it('should navigate to ComeBackLater when pressing "Je n’ai pas ma pièce d’identité originale" button', async () => {
    render(<SelectIDStatus />)

    const button = screen.getByText('Je n’ai pas ma pièce d’identité originale avec moi')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('ComeBackLater', undefined)
    })
  })

  it("should navigate to ExpiredOrLostID when pressing 'Ma pièce d'identité est expirée ou perdue' button", async () => {
    render(<SelectIDStatus />)

    const button = screen.getByText('Ma pièce d’identité est expirée ou perdue')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('ExpiredOrLostID', undefined)
    })
  })

  it('should log screen view when the screen is mounted', async () => {
    render(<SelectIDStatus />)

    await waitFor(() => expect(analytics.logScreenViewSelectIdStatus).toHaveBeenCalledTimes(1))
  })

  it('should log analytics with id_ok type when pressing "J’ai ma pièce d’identité" button', async () => {
    render(<SelectIDStatus />)

    const button = screen.getByText('J’ai ma pièce d’identité en cours de validité')
    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logSelectIdStatusClicked).toHaveBeenNthCalledWith(1, 'id_ok')
    })
  })

  it("should log analytics with no_id type when pressing 'Je n’ai pas ma pièce d’identité originale' button", async () => {
    render(<SelectIDStatus />)

    const button = screen.getByText('Je n’ai pas ma pièce d’identité originale avec moi')
    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logSelectIdStatusClicked).toHaveBeenNthCalledWith(1, 'no_id')
    })
  })

  it("should log analytics with expired_or_lost type when pressing 'Ma pièce d'identité est expirée ou perdue' button", async () => {
    render(<SelectIDStatus />)

    const button = screen.getByText('Ma pièce d’identité est expirée ou perdue')
    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logSelectIdStatusClicked).toHaveBeenNthCalledWith(1, 'expired_or_lost')
    })
  })
})
