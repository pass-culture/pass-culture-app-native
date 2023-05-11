import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { SetSchoolType } from 'features/identityCheck/pages/profile/SetSchoolType'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, waitFor, screen } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

let mockStatus = ActivityIdEnum.MIDDLE_SCHOOL_STUDENT
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

describe('<SetSchoolType />', () => {
  it('shoud render a list of middle school types if profile.status is middleSchoolStudent', () => {
    renderSetSchoolType()
    expect(screen).toMatchSnapshot()
  })

  it('shoud render a list of high school types if profile.status is highSchoolStudent', () => {
    mockStatus = ActivityIdEnum.HIGH_SCHOOL_STUDENT

    renderSetSchoolType()
    expect(screen).toMatchSnapshot()
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetSchoolType()

    await waitFor(() => expect(analytics.logScreenViewSetSchoolType).toHaveBeenCalledTimes(1))
  })

  it('should log analytics on press Continuer', async () => {
    renderSetSchoolType()

    fireEvent.press(screen.getByText(SchoolTypesSnap.school_types[0].label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => expect(analytics.logSetSchoolTypeClicked).toHaveBeenCalledTimes(1))
  })

  it('should navigate to stepper on press continue button', async () => {
    renderSetSchoolType()

    fireEvent.press(screen.getByText(SchoolTypesSnap.school_types[0].label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('Stepper'))
  })
})

function renderSetSchoolType() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<SetSchoolType />))
}
