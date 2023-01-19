import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectIDStatus } from 'features/identityCheck/pages/identification/identificationStart/SelectIDStatus'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, waitFor } from 'tests/utils'

describe('SelectIDStatus', () => {
  it('should render SelectIDStatus page correctly', () => {
    const renderAPI = render(<SelectIDStatus />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to ubble webview when pressing "J’ai ma pièce d’identité en cours de validité" button', async () => {
    const { getByText } = render(<SelectIDStatus />)

    const button = getByText('J’ai ma pièce d’identité en cours de validité')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('UbbleWebview', undefined)
    })
  })

  it('should navigate to ComeBackLater when pressing "Je n’ai pas ma pièce d’identité originale" button', async () => {
    const { getByText } = render(<SelectIDStatus />)

    const button = getByText('Je n’ai pas ma pièce d’identité originale avec moi')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('ComeBackLater', undefined)
    })
  })

  it("should navigate to ExpiredOrLostID when pressing 'Ma pièce d'identité est expirée ou perdue' button", async () => {
    const { getByText } = render(<SelectIDStatus />)

    const button = getByText('Ma pièce d’identité est expirée ou perdue')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('ExpiredOrLostID', undefined)
    })
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<SelectIDStatus />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_select_id_status')
    )
  })

  it('should send an amplitude event select_id_status_clicked with id_ok type when pressing "J’ai ma pièce d’identité" button', async () => {
    const { getByText } = render(<SelectIDStatus />)

    const button = getByText('J’ai ma pièce d’identité en cours de validité')
    fireEvent.press(button)

    await waitFor(() => {
      // first call will be the event screen_view_select_id_status on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'select_id_status_clicked', {
        type: 'id_ok',
      })
    })
  })

  it("should send an amplitude event select_id_status_clicked with no_id type when pressing 'Je n’ai pas ma pièce d’identité originale' button", async () => {
    const { getByText } = render(<SelectIDStatus />)

    const button = getByText('Je n’ai pas ma pièce d’identité originale avec moi')
    fireEvent.press(button)

    await waitFor(() => {
      // first call will be the event screen_view_select_id_status on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'select_id_status_clicked', {
        type: 'no_id',
      })
    })
  })

  it("should send an amplitude event select_id_status_clicked with expired_or_lost type when pressing 'Ma pièce d'identité est expirée ou perdue' button", async () => {
    const { getByText } = render(<SelectIDStatus />)

    const button = getByText('Ma pièce d’identité est expirée ou perdue')
    fireEvent.press(button)

    await waitFor(() => {
      // first call will be the event screen_view_select_id_status on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'select_id_status_clicked', {
        type: 'expired_or_lost',
      })
    })
  })
})
