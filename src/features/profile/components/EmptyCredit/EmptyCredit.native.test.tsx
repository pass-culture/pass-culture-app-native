import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EligibilityType } from 'api/gen'
import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { render, screen, userEvent } from 'tests/utils'

jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery').mockReturnValue({
  ...remoteConfigResponseFixture,
  data: { ...DEFAULT_REMOTE_CONFIG, homeEntryIdFreeOffers: 'homeEntryIdFreeOffers' },
})

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

  it('should default to standard phrasing when eligibility is null', () => {
    render(<EmptyCredit age={15} />)

    expect(screen.getByText(/Ton prochain crédit de/)).toBeOnTheScreen()
    expect(screen.getByText(/sera débloqué à 17 ans/)).toBeOnTheScreen()
  })

  it('should use free user phrasing when eligibility is free', () => {
    render(<EmptyCredit age={15} eligibility={EligibilityType.free} />)

    expect(screen.getByText(/Tu pourras débloquer ton prochain crédit de/)).toBeOnTheScreen()
    expect(screen.getByText(/à 17 ans/)).toBeOnTheScreen()
  })
})
