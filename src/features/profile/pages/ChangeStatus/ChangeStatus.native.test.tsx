import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { ActivityIdEnum, UserProfileResponse } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

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

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

let mockIsLoading = false
const mockActivities = ActivityTypesSnap.activities
jest.mock('features/identityCheck/queries/useActivityTypesQuery', () => {
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

  describe('without previous screen', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { type: undefined } })
    })

    it('should render correctly', async () => {
      mockedUseIsUserUnderage.mockReturnValueOnce(true)
      mockIsLoading = false

      renderChangedStatus()
      await screen.findByText('Modifier mon statut')

      expect(screen).toMatchSnapshot()
    })

    it('should show loading component', async () => {
      mockedUseIsUserUnderage.mockReturnValueOnce(true)
      mockIsLoading = true

      renderChangedStatus()
      await screen.findByText('Modifier mon statut')

      expect(screen).toMatchSnapshot()
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

    it('should show snackbar on success when clicking on "Valider mon adresse"', async () => {
      renderChangedStatus()
      mockServer.patchApi<UserProfileResponse>('/v1/profile', beneficiaryUser)

      await user.press(screen.getByText('Employé'))
      await user.press(screen.getByText('Continuer'))

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Ton statut a bien été modifié\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  describe('from mandatory udpate personal data screen', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: { type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA },
      })
    })

    it('should render correctly', async () => {
      mockedUseIsUserUnderage.mockReturnValueOnce(true)
      mockIsLoading = false

      renderChangedStatus()
      await screen.findByText('Modifier mon statut')

      expect(screen).toMatchSnapshot()
    })

    it('should show snackbar on success when clicking on "Valider mon adresse"', async () => {
      renderChangedStatus()
      mockServer.patchApi<UserProfileResponse>('/v1/profile', beneficiaryUser)

      await user.press(screen.getByText('Employé'))
      await user.press(screen.getByText('Continuer'))

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Tes informations ont bien été modifiés\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })
})

function renderChangedStatus() {
  return render(reactQueryProviderHOC(<ChangeStatus />))
}
