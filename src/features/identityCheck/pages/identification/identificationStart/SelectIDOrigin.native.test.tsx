import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/identificationStart/SelectIDOrigin'
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

  it('should navigate to SelectIDStatus on press french HeroButtonList', () => {
    const { getByTestId } = render(<SelectIDOrigin />)

    const HeroButtonListFrench = getByTestId('J’ai une carte d’identité ou un passeport français')
    fireEvent.press(HeroButtonListFrench)

    expect(navigate).toHaveBeenCalledWith('SelectIDStatus', undefined)
  })

  it('should navigate to DMSIntroduction with foreign parameter on press foreign button', () => {
    const { getByText } = render(<SelectIDOrigin />)

    const ButtonForeign = getByText(
      'J’ai un titre de séjour, une carte d’identité ou un passeport étranger.'
    )
    fireEvent.press(ButtonForeign)

    expect(navigate).toHaveBeenCalledWith('DMSIntroduction', { isForeignDMSInformation: true })
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<SelectIDOrigin />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_select_id_origin')
    )
  })
})
