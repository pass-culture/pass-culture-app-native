import React from 'react'

import { ActivityIdEnum, UserProfileResponse } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor, userEvent } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const mockStatus: ActivityIdEnum | null = null

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

let mockIsLoading = false
const mockActivities = ActivityTypesSnap.activities
jest.mock('features/identityCheck/api/useActivityTypes', () => {
  return {
    useActivityTypes: jest.fn(() => {
      return {
        activities: mockActivities,
        isLoading: mockIsLoading,
      }
    }),
  }
})

jest.mock('features/profile/helpers/useIsUserUnderage')
const mockedUseIsUserUnderage = jest.spyOn(UnderageUserAPI, 'useIsUserUnderage')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/context/AuthContext')
mockAuthContextWithUser(beneficiaryUser)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<ChangeStatus/>', () => {
  beforeEach(async () => {
    mockServer.postApi('/v1/subscription/profile', {})
  })

  it('should render correctly', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    mockIsLoading = false
    renderChangedStatus()

    await waitFor(() => expect(screen).toMatchSnapshot())
  })

  it('should show loading component', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    mockIsLoading = true
    renderChangedStatus()

    await waitFor(() => expect(screen).toMatchSnapshot())
  })

  it('should send analytics event when success', async () => {
    renderChangedStatus()
    mockServer.patchApi<UserProfileResponse>('/v1/profile', beneficiaryUser)

    await user.press(screen.getByText('Employé'))

    await user.press(screen.getByText('Continuer'))

    expect(analytics.logUpdateStatus).toHaveBeenCalledWith({
      oldStatus: beneficiaryUser.activityId,
      newStatus: ActivityIdEnum.EMPLOYEE,
    })
  })
})

function renderChangedStatus() {
  return render(reactQueryProviderHOC(<ChangeStatus />))
}
