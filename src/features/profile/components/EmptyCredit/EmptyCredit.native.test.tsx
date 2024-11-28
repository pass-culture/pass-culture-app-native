import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { fireEvent, render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider', () => ({
  useRemoteConfigContext: jest
    .fn()
    .mockReturnValue({ homeEntryIdFreeOffers: 'homeEntryIdFreeOffers' }),
}))

describe('<EmptyCredit />', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it.each([15, 16, 17])('should render correctly for %s yo', (age) => {
    render(<EmptyCredit age={age} />)

    expect(screen.getByText('Profite d’offres gratuites')).toBeOnTheScreen()
  })

  it('should not render when age is 18', () => {
    render(<EmptyCredit age={18} />)

    expect(screen.queryByText('Profite d’offres gratuites')).not.toBeOnTheScreen()
  })

  it('should navigate to thematic home with remote config homeId on button press', () => {
    render(<EmptyCredit age={16} />)

    fireEvent.press(screen.getByText('Profite d’offres gratuites'))

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: 'homeEntryIdFreeOffers',
      from: 'profile',
    })
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
