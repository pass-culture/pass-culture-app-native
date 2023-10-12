import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/ubble/SelectIDOrigin'
// eslint-disable-next-line no-restricted-imports
import { analytics } from 'libs/analytics'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

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
    render(<SelectIDOrigin />)

    const HeroButtonListFrench = screen.getByTestId(
      'J’ai une carte d’identité ou un passeport français'
    )
    fireEvent.press(HeroButtonListFrench)

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('SelectIDStatus', undefined))
  })

  it('should navigate to DMSIntroduction with foreign parameter on press foreign HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const ButtonForeign = screen.getByText(
      'J’ai un titre de séjour, une carte d’identité ou un passeport étranger.'
    )
    fireEvent.press(ButtonForeign)

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('DMSIntroduction', {
        isForeignDMSInformation: true,
      })
    )
  })

  it('should log screen view when the screen is mounted', async () => {
    render(<SelectIDOrigin />)

    await waitFor(() => expect(analytics.logScreenViewSelectIdOrigin).toHaveBeenCalledTimes(1))
  })

  it('should log analytics with french type on press french HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const HeroButtonListFrench = screen.getByTestId(
      'J’ai une carte d’identité ou un passeport français'
    )
    fireEvent.press(HeroButtonListFrench)

    await waitFor(() =>
      expect(analytics.logSetIdOriginClicked).toHaveBeenNthCalledWith(1, 'France')
    )
  })

  it('should log analytics with foregin type on press foreign HeroButtonList', async () => {
    render(<SelectIDOrigin />)

    const ButtonForeign = screen.getByText(
      'J’ai un titre de séjour, une carte d’identité ou un passeport étranger.'
    )
    fireEvent.press(ButtonForeign)

    await waitFor(() =>
      expect(analytics.logSetIdOriginClicked).toHaveBeenNthCalledWith(1, 'Foreign')
    )
  })
})
