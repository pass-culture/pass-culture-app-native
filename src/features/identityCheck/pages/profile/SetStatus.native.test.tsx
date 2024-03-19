import React from 'react'

import { dispatch } from '__mocks__/@react-navigation/native'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
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

describe('<SetStatus/>', () => {
  beforeEach(async () => {
    mockServer.postApi('/v1/subscription/profile', {})
    await storage.saveObject('activation_profile', profile)
  })

  afterEach(() => {
    storage.clear('activation_profile')
  })

  it('should render correctly', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    renderSetStatus()

    await waitFor(() => expect(screen).toMatchSnapshot())
  })

  it('should navigate to stepper on press "Continuer"', async () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    mockStatus = ActivityTypesSnap.activities[2].id
    renderSetStatus()

    // @ts-expect-error: because of noUncheckedIndexedAccess
    fireEvent.press(screen.getByText(ActivityTypesSnap.activities[2].label)) // select student status
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        payload: { index: 1, routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }] },
        type: 'RESET',
      })
    })
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetStatus()

    await waitFor(() => expect(analytics.logScreenViewSetStatus).toHaveBeenCalledTimes(1))
  })

  it('should log analytics on press Continuer', async () => {
    renderSetStatus()

    // @ts-expect-error: because of noUncheckedIndexedAccess
    fireEvent.press(screen.getByText(ActivityTypesSnap.activities[1].label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(analytics.logSetStatusClicked).toHaveBeenCalledTimes(1)
    })
  })
})

function renderSetStatus() {
  return render(reactQueryProviderHOC(<SetStatus />))
}
