import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueTopComponent } from 'features/venue/components/VenueTopComponent/VenueTopComponent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useLocation } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils/web'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/location')
jest.mocked(useLocation)
jest.mock('@react-native-clipboard/clipboard')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<VenueTopComponent />', () => {
  it('should navigate to venue preview carousel', async () => {
    render(
      reactQueryProviderHOC(
        <VenueTopComponent
          venue={{
            ...venueDataTest,
            bannerUrl: 'https://image.com',
            bannerMeta: { is_from_google: false, image_credit: 'François Boulo' },
          }}
        />
      )
    )

    fireEvent.click(screen.getByTestId('venueImage'))

    expect(navigate).not.toHaveBeenCalled()
  })
})
