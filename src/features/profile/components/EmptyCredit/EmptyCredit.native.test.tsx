import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider', () => ({
  useRemoteConfigContext: jest
    .fn()
    .mockReturnValue({ homeEntryIdFreeOffers: 'homeEntryIdFreeOffers' }),
}))

describe('<EmptyCredit />', () => {
  it.each([15, 16, 17, 18])('should render correctly for %s yo', (age) => {
    render(<EmptyCredit age={age} />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to thematic home with remote config homeId on button press', () => {
    render(<EmptyCredit age={16} />)

    fireEvent.press(screen.getByText('Profite d’offres gratuites'))

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: 'homeEntryIdFreeOffers',
      from: 'EmptyCredit',
    })
  })
})
