import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { dispatch, reset } from '__mocks__/@react-navigation/native'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

let mockStatus: ActivityIdEnum | null = null

const profile = {
  name: {
    firstName: 'Jean',
    lastName: 'Dupont',
  },
  city: {
    name: 'Paris',
    postalCode: '75011',
  },
  address: '1 rue du désespoir',
  status: mockStatus,
}

jest.mock('libs/jwt/jwt')
jest.mock('features/identityCheck/pages/profile/store/nameStore')
;(useName as jest.Mock).mockReturnValue(profile.name)

jest.mock('features/identityCheck/pages/profile/store/cityStore')
;(useCity as jest.Mock).mockReturnValue(profile.city)

jest.mock('features/identityCheck/pages/profile/store/addressStore')
;(useAddress as jest.Mock).mockReturnValue(profile.address)

let mockOfferId: number | null = 123456
jest.mock('features/offer/store/freeOfferIdStore', () => ({
  useFreeOfferId: () => mockOfferId,
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
    profile: {
      name: {
        firstName: 'Jean',
        lastName: 'Dupont',
      },
      city: {
        name: 'Paris',
        postalCode: '75011',
      },
      address: '1 rue du désespoir',
      status: mockStatus,
    },
  })),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const mockActivities = ActivityTypesSnap.activities
jest.mock('features/identityCheck/api/useActivityTypes', () => {
  return {
    useActivityTypes: jest.fn(() => {
      return {
        activities: mockActivities,
      }
    }),
  }
})

jest.mock('features/profile/helpers/useIsUserUnderage')
const mockedUseIsUserUnderage = jest.spyOn(UnderageUserAPI, 'useIsUserUnderage')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<SetStatus/>', () => {
  beforeEach(async () => {
    setFeatureFlags()
    mockServer.postApi('/v1/subscription/profile', {})
  })

  it('should render correctly', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    renderSetStatus({ type: ProfileTypes.IDENTITY_CHECK })

    await waitFor(() => expect(screen).toMatchSnapshot())
  })

  it('should display correct infos in identity check', async () => {
    renderSetStatus({ type: ProfileTypes.IDENTITY_CHECK })

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    renderSetStatus({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
  })

  it('should navigate to stepper on press "Continuer"', async () => {
    mockStatus = ActivityTypesSnap.activities[2].id
    renderSetStatus({ type: ProfileTypes.IDENTITY_CHECK })

    await user.press(screen.getByText(ActivityTypesSnap.activities[2].label)) // select student status

    await user.press(screen.getByText('Continuer'))

    expect(dispatch).toHaveBeenCalledWith({
      payload: { index: 1, routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }] },
      type: 'RESET',
    })
  })

  it('should log analytics on press Continuer', async () => {
    renderSetStatus({ type: ProfileTypes.IDENTITY_CHECK })

    await user.press(screen.getByText(ActivityTypesSnap.activities[1].label))
    await user.press(screen.getByText('Continuer'))

    expect(analytics.logSetStatusClicked).toHaveBeenCalledTimes(1)
  })

  it('should not navigate to Offer screen if booking free offer and offer ID exists but FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable', async () => {
    mockStatus = ActivityTypesSnap.activities[0].id

    renderSetStatus({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).not.toHaveBeenCalled()
  })

  it('should navigate to Offer screen if booking free offer and offer ID exists when FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
    mockStatus = ActivityTypesSnap.activities[0].id

    renderSetStatus({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).toHaveBeenCalledWith({
      routes: [{ name: 'Offer', params: { id: mockOfferId } }],
    })
  })

  it('should not navigate to Offer screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable', async () => {
    mockStatus = ActivityTypesSnap.activities[0].id
    mockOfferId = null

    renderSetStatus({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).not.toHaveBeenCalled()
  })

  it('should not navigate to Offer screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
    mockStatus = ActivityTypesSnap.activities[0].id
    mockOfferId = null

    renderSetStatus({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).not.toHaveBeenCalled()
  })
})

const renderSetStatus = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'SetStatus'
  >
  return render(reactQueryProviderHOC(<SetStatus {...navProps} />))
}
