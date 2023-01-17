import { NavigationContainer } from '@react-navigation/native'
import React, { NamedExoticComponent } from 'react'
import waitForExpect from 'wait-for-expect'

import * as Auth from 'features/auth/context/AuthContext'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { TabStack } from 'features/navigation/TabBar/Stack'
import * as Share from 'features/share/helpers/shareApp'
import { nonBeneficiaryUser } from 'fixtures/user'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import {
  GeolocPositionError,
  GeolocPermissionState,
  GeolocationError,
  GeoCoordinates,
  GEOLOCATION_USER_ERROR_MESSAGE,
} from 'libs/geolocation'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import {
  flushAllPromisesWithAct,
  render,
  act,
  fireEvent,
  cleanup,
  middleScrollEvent,
  bottomScrollEvent,
} from 'tests/utils'

import { Profile } from './Profile'

jest.mock('react-query')

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}))
jest.mock('@react-navigation/bottom-tabs', () =>
  jest.requireActual('@react-navigation/bottom-tabs')
)

const mockedUseAuthContext = jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  isLoggedIn: true,
  user: nonBeneficiaryUser,
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}) as jest.Mock

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates
let mockPermissionState = GeolocPermissionState.GRANTED
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
let mockPositionError: GeolocationError | null = null
const mockTriggerPositionUpdate = jest.fn()
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    position: mockPosition,
    positionError: mockPositionError,
    triggerPositionUpdate: mockTriggerPositionUpdate,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

const mockFavoritesState = initialFavoritesState
const mockFavoriteDispatch = jest.fn()
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: mockFavoriteDispatch,
  }),
}))

jest.mock('shared/user/useDepositAmountsByAge')

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ identification: { processing: false } }),
}))

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

const shareApp = jest.spyOn(Share, 'shareApp')

describe('Profile component', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  afterEach(() => {
    mockPermissionState = GeolocPermissionState.GRANTED
    mockPosition = DEFAULT_POSITION
    mockPositionError = null
    cleanup()
  })

  it('should render correctly', async () => {
    const renderAPI = await renderProfile()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render offline page when not connected', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    const renderAPI = await renderProfile()
    expect(renderAPI.queryByText('Pas de réseau internet')).toBeTruthy()
  })

  describe('user settings section', () => {
    it('should navigate when the personal data row is clicked', async () => {
      const { getByText } = await renderProfile()

      const row = getByText('Informations personnelles')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('PersonalData', undefined)
    })

    describe('geolocation switch', () => {
      it('should display switch ON if geoloc permission is granted', async () => {
        mockPermissionState = GeolocPermissionState.GRANTED

        const { getByTestId, queryByText } = await renderProfile()
        const geolocSwitch = getByTestId('Interrupteur')
        const positionErrorMessage = queryByText(
          `La géolocalisation est temporairement inutilisable sur ton téléphone`
        )
        expect(positionErrorMessage).toBeFalsy()
        expect(geolocSwitch.parent?.props.accessibilityState.checked).toBeTruthy()
      })

      it('should display position error message if geoloc permission is granted but position is null', async () => {
        mockPermissionState = GeolocPermissionState.GRANTED
        mockPosition = null
        mockPositionError = {
          type: GeolocPositionError.SETTINGS_NOT_SATISFIED,
          message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED],
        }

        const { queryByText } = await renderProfile()
        expect(queryByText(mockPositionError.message)).toBeTruthy()
      })

      it('should display switch OFF if geoloc permission is denied', async () => {
        mockPermissionState = GeolocPermissionState.DENIED
        const { getByTestId } = await renderProfile()
        const geolocSwitch = getByTestId('Interrupteur')
        expect(geolocSwitch.parent?.props.accessibilityState.checked).toBeFalsy()
      })

      it('should open "Deactivate geoloc" modal when clicking on ACTIVE switch and call mockFavoriteDispatch()', async () => {
        // geolocation switch is ON and user wants to switch it OFF
        mockPermissionState = GeolocPermissionState.GRANTED
        const { getByTestId } = await renderProfile({
          wrapper: FavoritesWrapper,
        })

        fireEvent.press(getByTestId('Interrupteur'))

        expect(mockFavoriteDispatch).toBeCalledWith({
          type: 'SET_SORT_BY',
          payload: 'RECENTLY_ADDED',
        })
        expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
      })
    })
    it('should navigate when the notifications row is clicked', async () => {
      const { getByText } = await renderProfile()

      const row = getByText('Notifications')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('NotificationSettings', undefined)
    })
  })

  describe('help section', () => {
    it('should navigate when the how-it-works row is clicked', async () => {
      const { getByText } = await renderProfile()

      const row = getByText('Comment ça marche\u00a0?')
      fireEvent.press(row)

      await waitForExpect(() => {
        expect(mockNavigate).toBeCalledWith('FirstTutorial', { shouldCloseAppOnBackAction: false })
      })
    })

    it('should navigate when the faq row is clicked', async () => {
      const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
      const { getByText } = await renderProfile()

      const row = getByText(`Centre d'aide`)
      fireEvent.press(row)

      expect(openUrl).toBeCalledWith(env.FAQ_LINK, undefined, true)
    })
  })

  describe('other section', () => {
    it('should navigate when the accessibility row is clicked', async () => {
      const { getByText } = await renderProfile()

      const row = getByText('Accessibilité')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('Accessibility', undefined)
    })

    it('should navigate when the legal notices row is clicked', async () => {
      const { getByText } = await renderProfile()

      const row = getByText('Informations légales')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('LegalNotices', undefined)
    })

    it('should navigate when the confidentiality row is clicked', async () => {
      const { getByText } = await renderProfile()

      const row = getByText('Confidentialité')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('ConsentSettings', undefined)
    })
  })

  describe('share app section', () => {
    it('should display banner in native', async () => {
      const { queryByText } = await renderProfile()
      const banner = queryByText('Partage le pass Culture')
      expect(banner).toBeTruthy()
    })

    it('should share app on banner press', async () => {
      const { getByText } = await renderProfile()
      const banner = getByText('Partage le pass Culture')

      fireEvent.press(banner)

      expect(shareApp).toHaveBeenCalledTimes(1)
    })
  })

  describe('signout section', () => {
    it('should display signout row if the user is connected', async () => {
      const { getByText } = await renderProfile()
      const row = getByText('Déconnexion')
      expect(row).toBeTruthy()
    })

    it('should NOT display signout row if the user is NOT connected', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockedUseAuthContext.mockImplementation(() => ({ isLoggedIn: false }))
      const { queryByText } = await renderProfile()
      const row = queryByText('Déconnexion')
      expect(row).toBeFalsy()
    })

    it('should delete the refreshToken, clean user profile and remove user ID from batch when pressed', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockedUseAuthContext.mockImplementation(() => ({
        isLoggedIn: true,
        user: nonBeneficiaryUser,
      }))
      const { getByText } = await renderProfile()

      const row = getByText('Déconnexion')
      fireEvent.press(row)

      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  describe('Analytics', () => {
    it('should log event ConsultTutorial when user clicks on tutorial section', async () => {
      const { getByText } = await renderProfile()

      const row = getByText('Comment ça marche\u00a0?')
      fireEvent.press(row)
      expect(analytics.logConsultTutorial).toHaveBeenNthCalledWith(1, 'profile')
    })

    it('should log event ProfilScrolledToBottom when user reach end of screen', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockedUseAuthContext.mockImplementation(() => ({
        isLoggedIn: true,
        user: nonBeneficiaryUser,
      }))
      const { getByTestId } = await renderProfile()
      const scrollContainer = getByTestId('profile-scrollview')
      await act(async () => await fireEvent.scroll(scrollContainer, middleScrollEvent))
      expect(analytics.logProfilScrolledToBottom).toBeCalledTimes(0)
      await act(async () => await fireEvent.scroll(scrollContainer, bottomScrollEvent))
      expect(analytics.logProfilScrolledToBottom).toBeCalledTimes(1)
    })
  })
})

interface Options {
  wrapper?: NamedExoticComponent<{ children: JSX.Element }> | undefined
}

const defaultOptions = {
  wrapper: undefined,
}

async function renderProfile(options: Options = defaultOptions) {
  const { wrapper } = { ...defaultOptions, ...options }
  const renderAPI = render(
    <NavigationContainer>
      <TabStack.Navigator initialRouteName="Profile">
        <TabStack.Screen name="Profile" component={Profile} />
      </TabStack.Navigator>
    </NavigationContainer>,
    { wrapper }
  )
  await flushAllPromisesWithAct()
  return renderAPI
}
