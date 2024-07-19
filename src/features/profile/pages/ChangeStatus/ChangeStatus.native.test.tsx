import React from 'react'

import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import {
  useAddress,
  useAddressActions,
} from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity, useCityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName, useNameActions } from 'features/identityCheck/pages/profile/store/nameStore'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'
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
})

function renderChangedStatus() {
  return render(reactQueryProviderHOC(<ChangeStatus />))
}
