import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { render, screen, userEvent } from 'tests/utils'

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue({ ...DEFAULT_REMOTE_CONFIG, homeEntryIdFreeOffers: 'homeEntryIdFreeOffers' })

const user = userEvent.setup()
jest.useFakeTimers()

describe('<EmptyCredit />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it.each([15, 16, 17])('should render correctly for %s yo', (age) => {
    render(<EmptyCredit age={age} />)

    expect(screen.getByText('Profite d’offres gratuites')).toBeOnTheScreen()
  })

  it('should not render when age is 18', () => {
    render(<EmptyCredit age={18} />)

    expect(screen.queryByText('Profite d’offres gratuites')).not.toBeOnTheScreen()
  })

  it('should navigate to thematic home with remote config homeId on button press', async () => {
    render(<EmptyCredit age={16} />)

    await user.press(screen.getByText('Profite d’offres gratuites'))

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: 'homeEntryIdFreeOffers',
      from: 'profile',
    })
  })

  it('should show credit at 17 for 15 year olds', () => {
    render(<EmptyCredit age={15} />)

    expect(screen.getByText(/sera débloqué à 17 ans/)).toBeOnTheScreen()
  })

  it('should show credit at 17 for 16 year olds', () => {
    render(<EmptyCredit age={16} />)

    expect(screen.getByText(/sera débloqué à 17 ans/)).toBeOnTheScreen()
  })

  it('should show credit at 18 for 17 year olds', () => {
    render(<EmptyCredit age={17} />)

    expect(screen.getByText(/sera débloqué à 18 ans/)).toBeOnTheScreen()
  })
})
