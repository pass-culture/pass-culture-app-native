import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

let mockStatus: ActivityIdEnum | null = null
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

server.use(
  rest.post(env.API_BASE_URL + '/native/v1/subscription/profile', async (_, res, ctx) => {
    return res(ctx.status(200))
  })
)

const mockSchoolTypes = SchoolTypesSnap.school_types
const mockActivities = SchoolTypesSnap.activities
jest.mock('features/identityCheck/api/useProfileOptions', () => {
  return {
    useProfileOptions: jest.fn(() => {
      return {
        schoolTypes: mockSchoolTypes,
        activities: mockActivities,
      }
    }),
  }
})

jest.mock('features/profile/helpers/useIsUserUnderage')
const mockedUseIsUserUnderage = jest.spyOn(UnderageUserAPI, 'useIsUserUnderage')

describe('<SetStatus/>', () => {
  it('should render correctly', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    renderSetStatus()

    await waitFor(() => expect(screen).toMatchSnapshot())
  })

  // TODO(PC-12410): déléguer la responsabilité au back de faire cette filtration
  it('should render with no Collégien status if user is over 18', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(false)
    renderSetStatus()

    await waitFor(() => expect(screen.queryByText(SchoolTypesSnap.activities[0].label)).toBe(null))
  })

  it('should navigate to stepper on press "Continuer" when user should not select school type', async () => {
    mockStatus = SchoolTypesSnap.activities[2].id
    renderSetStatus()

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[2].label)) // select student status
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Stepper')
    })
  })

  it('should navigate to SetSchoolType on press "Continuer" when user should select school type', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    mockStatus = SchoolTypesSnap.activities[1].id

    renderSetStatus()

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[1].label)) // select high school status
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SetSchoolType')
    })
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetStatus()

    await waitFor(() => expect(analytics.logScreenViewSetStatus).toHaveBeenCalledTimes(1))
  })

  it('should log analytics on press Continuer', async () => {
    renderSetStatus()

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[1].label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(analytics.logSetStatusClicked).toHaveBeenCalledTimes(1)
    })
  })
})

function renderSetStatus() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<SetStatus />))
}
