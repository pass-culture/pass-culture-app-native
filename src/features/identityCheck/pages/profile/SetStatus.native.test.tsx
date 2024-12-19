import React from 'react'

import { dispatch } from '__mocks__/@react-navigation/native'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import {
  useAddress,
  useAddressActions,
} from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity, useCityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName, useNameActions } from 'features/identityCheck/pages/profile/store/nameStore'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
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
;(useNameActions as jest.Mock).mockReturnValue({ resetName: jest.fn() })

jest.mock('features/identityCheck/pages/profile/store/cityStore')
;(useCity as jest.Mock).mockReturnValue(profile.city)
;(useCityActions as jest.Mock).mockReturnValue({ resetCity: jest.fn() })

jest.mock('features/identityCheck/pages/profile/store/addressStore')
;(useAddress as jest.Mock).mockReturnValue(profile.address)
;(useAddressActions as jest.Mock).mockReturnValue({ resetAddress: jest.fn() })

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

describe('<SetStatus/>', () => {
  beforeEach(async () => {
    mockServer.postApi('/v1/subscription/profile', {})
  })

  it('should render correctly', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    renderSetStatus()

    await waitFor(() => expect(screen).toMatchSnapshot())
  })

  it('should navigate to stepper on press "Continuer"', async () => {
    mockStatus = ActivityTypesSnap.activities[2].id
    renderSetStatus()

    await act(async () => {
      fireEvent.press(screen.getByText(ActivityTypesSnap.activities[2].label)) // select student status
    })

    await act(async () => {
      fireEvent.press(screen.getByText('Continuer'))
    })

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        payload: { index: 1, routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }] },
        type: 'RESET',
      })
    })
  })

  it('should log analytics on press Continuer', async () => {
    renderSetStatus()

    await act(async () => {
      fireEvent.press(screen.getByText(ActivityTypesSnap.activities[1].label))
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Continuer'))
    })

    await waitFor(() => {
      expect(analytics.logSetStatusClicked).toHaveBeenCalledTimes(1)
    })
  })
})

function renderSetStatus() {
  return render(reactQueryProviderHOC(<SetStatus />))
}
