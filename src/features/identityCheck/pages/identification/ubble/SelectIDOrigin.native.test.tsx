import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/ubble/SelectIDOrigin'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, waitFor } from 'tests/utils'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))
describe('SelectIDOrigin', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SelectIDOrigin />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to SelectIDStatus on press french HeroButtonList', async () => {
    const { getByTestId } = render(<SelectIDOrigin />)

    const HeroButtonListFrench = getByTestId('J’ai une carte d’identité ou un passeport français')
    fireEvent.press(HeroButtonListFrench)

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('SelectIDStatus', undefined))
  })

  it('should navigate to DMSIntroduction with foreign parameter on press foreign HeroButtonList', async () => {
    const { getByText } = render(<SelectIDOrigin />)

    const ButtonForeign = getByText(
      'J’ai un titre de séjour, une carte d’identité ou un passeport étranger.'
    )
    fireEvent.press(ButtonForeign)

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('DMSIntroduction', { isForeignDMSInformation: true })
    )
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<SelectIDOrigin />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_select_id_origin')
    )
  })

  it('should send an amplitude event set_id_origin_clicked with french type on press french HeroButtonList', async () => {
    const { getByTestId } = render(<SelectIDOrigin />)

    const HeroButtonListFrench = getByTestId('J’ai une carte d’identité ou un passeport français')
    fireEvent.press(HeroButtonListFrench)

    await waitFor(() =>
      // first call will be the event screen_view_select_id_origin on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'set_id_origin_clicked', {
        type: 'France',
      })
    )
  })

  it('should send an amplitude event set_id_origin_clicked with foregin type on press foreign HeroButtonList', async () => {
    const { getByText } = render(<SelectIDOrigin />)

    const ButtonForeign = getByText(
      'J’ai un titre de séjour, une carte d’identité ou un passeport étranger.'
    )
    fireEvent.press(ButtonForeign)

    await waitFor(() =>
      // first call will be the event screen_view_select_id_origin on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'set_id_origin_clicked', {
        type: 'Foreign',
      })
    )
  })
})
