import { NavigationContainer } from '@react-navigation/native'
import React, { NamedExoticComponent } from 'react'

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
  Position,
} from 'libs/geolocation'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import {
  render,
  screen,
  fireEvent,
  middleScrollEvent,
  bottomScrollEvent,
  waitFor,
} from 'tests/utils'
import * as useVersion from 'ui/hooks/useVersion'

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
let mockPosition: Position = DEFAULT_POSITION
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

const useVersionSpy = jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.10.5')

const shareApp = jest.spyOn(Share, 'shareApp')

describe('Profile component', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  afterEach(() => {
    mockPermissionState = GeolocPermissionState.GRANTED
    mockPosition = DEFAULT_POSITION
    mockPositionError = null
  })

  it('should render correctly', () => {
    renderProfile()

    expect(screen).toMatchSnapshot()
  })

  it('should render offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderProfile()

    expect(screen.queryByText('Pas de réseau internet')).toBeTruthy()
  })

  it('should display the version with the CodePush version label', async () => {
    const mockVersion = 'Version\u00A01.10.5-123'
    useVersionSpy.mockReturnValueOnce(mockVersion)
    await renderProfile()

    expect(screen.getByText(mockVersion)).toBeTruthy()
  })

  it('should not display the Code push version label when it is not available', async () => {
    await renderProfile()

    expect(screen.getByText('Version\u00A01.10.5')).toBeTruthy()
  })

  describe('user settings section', () => {
    it('should navigate when the personal data row is clicked', () => {
      renderProfile()

      const row = screen.getByText('Informations personnelles')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('PersonalData', undefined)
    })

    describe('geolocation switch', () => {
      it('should display switch ON if geoloc permission is granted', () => {
        mockPermissionState = GeolocPermissionState.GRANTED
        renderProfile()

        const geolocSwitch = screen.getByTestId('Interrupteur')
        const positionErrorMessage = screen.queryByText(
          `La géolocalisation est temporairement inutilisable sur ton téléphone`
        )
        expect(positionErrorMessage).toBeFalsy()
        expect(geolocSwitch.parent?.props.accessibilityState.checked).toBeTruthy()
      })

      it('should display position error message if geoloc permission is granted but position is null', () => {
        mockPermissionState = GeolocPermissionState.GRANTED
        mockPosition = null
        mockPositionError = {
          type: GeolocPositionError.SETTINGS_NOT_SATISFIED,
          message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED],
        }
        renderProfile()

        expect(screen.queryByText(mockPositionError.message)).toBeTruthy()
      })

      it('should display switch OFF if geoloc permission is denied', () => {
        mockPermissionState = GeolocPermissionState.DENIED
        renderProfile()

        const geolocSwitch = screen.getByTestId('Interrupteur')
        expect(geolocSwitch.parent?.props.accessibilityState.checked).toBeFalsy()
      })

      it('should open "Deactivate geoloc" modal when clicking on ACTIVE switch and call mockFavoriteDispatch()', () => {
        // geolocation switch is ON and user wants to switch it OFF
        mockPermissionState = GeolocPermissionState.GRANTED
        renderProfile({
          wrapper: FavoritesWrapper,
        })

        fireEvent.press(screen.getByTestId('Interrupteur'))

        expect(mockFavoriteDispatch).toBeCalledWith({
          type: 'SET_SORT_BY',
          payload: 'RECENTLY_ADDED',
        })
        expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
      })
    })
    it('should navigate when the notifications row is clicked', () => {
      renderProfile()

      const notificationsButton = screen.getByText('Notifications')
      fireEvent.press(notificationsButton)

      expect(mockNavigate).toBeCalledWith('NotificationSettings', undefined)
    })
  })

  describe('help section', () => {
    it('should navigate when the how-it-works row is clicked', async () => {
      renderProfile()

      const howItWorkButton = screen.getByText('Comment ça marche\u00a0?')
      fireEvent.press(howItWorkButton)

      await waitFor(() => {
        expect(mockNavigate).toBeCalledWith('FirstTutorial', { shouldCloseAppOnBackAction: false })
      })
    })

    it('should navigate when the faq row is clicked', () => {
      const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
      renderProfile()

      const faqButton = screen.getByText('Centre d’aide')
      fireEvent.press(faqButton)

      expect(openUrl).toBeCalledWith(env.FAQ_LINK, undefined, true)
    })
  })

  describe('other section', () => {
    it('should navigate when the accessibility row is clicked', () => {
      renderProfile()

      const accessibilityButton = screen.getByText('Accessibilité')
      fireEvent.press(accessibilityButton)

      expect(mockNavigate).toBeCalledWith('Accessibility', undefined)
    })

    it('should navigate when the legal notices row is clicked', () => {
      renderProfile()

      const legalNoticesButton = screen.getByText('Informations légales')
      fireEvent.press(legalNoticesButton)

      expect(mockNavigate).toBeCalledWith('LegalNotices', undefined)
    })

    it('should navigate when the confidentiality row is clicked', () => {
      renderProfile()

      const confidentialityButton = screen.getByText('Confidentialité')
      fireEvent.press(confidentialityButton)

      expect(mockNavigate).toBeCalledWith('ConsentSettings', undefined)
    })
  })

  describe('share app section', () => {
    it('should display banner in native', () => {
      renderProfile()

      const shareButton = screen.queryByText('Partage le pass Culture')
      expect(shareButton).toBeTruthy()
    })

    it('should share app on banner press', () => {
      renderProfile()

      const shareButton = screen.getByText('Partage le pass Culture')
      fireEvent.press(shareButton)

      expect(shareApp).toHaveBeenCalledTimes(1)
    })
  })

  describe('signout section', () => {
    it('should display signout row if the user is connected', () => {
      renderProfile()

      const signoutButton = screen.getByText('Déconnexion')
      expect(signoutButton).toBeTruthy()
    })

    it('should NOT display signout row if the user is NOT connected', () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockedUseAuthContext.mockImplementation(() => ({ isLoggedIn: false }))
      renderProfile()

      const signoutButton = screen.queryByText('Déconnexion')
      expect(signoutButton).toBeFalsy()
    })

    it('should delete the refreshToken, clean user profile and remove user ID from batch when pressed', () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockedUseAuthContext.mockImplementation(() => ({
        isLoggedIn: true,
        user: nonBeneficiaryUser,
      }))
      renderProfile()

      const signoutButton = screen.getByText('Déconnexion')
      fireEvent.press(signoutButton)

      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  describe('Analytics', () => {
    it('should log event ConsultTutorial when user clicks on tutorial section', () => {
      renderProfile()

      const consultTutorialButton = screen.getByText('Comment ça marche\u00a0?')
      fireEvent.press(consultTutorialButton)

      expect(analytics.logConsultTutorial).toHaveBeenNthCalledWith(1, 'profile')
    })

    it('should log event ProfilScrolledToBottom when user reach end of screen', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      mockedUseAuthContext.mockImplementation(() => ({
        isLoggedIn: true,
        user: nonBeneficiaryUser,
      }))
      renderProfile()

      const scrollContainer = screen.getByTestId('profile-scrollview')
      fireEvent.scroll(scrollContainer, middleScrollEvent)

      expect(analytics.logProfilScrolledToBottom).toBeCalledTimes(0)

      fireEvent.scroll(scrollContainer, bottomScrollEvent)
      expect(analytics.logProfilScrolledToBottom).toBeCalledTimes(1)
    })

    it('should log event ShareApp on share banner press', () => {
      renderProfile()
      const banner = screen.getByText('Partage le pass Culture')

      fireEvent.press(banner)

      expect(analytics.logShareApp).toHaveBeenNthCalledWith(1, { from: 'profile' })
    })
  })
})

interface Options {
  wrapper?: NamedExoticComponent<{ children: JSX.Element }> | undefined
}

const defaultOptions = {
  wrapper: undefined,
}

function renderProfile(options: Options = defaultOptions) {
  const { wrapper } = { ...defaultOptions, ...options }
  const renderAPI = render(
    <NavigationContainer>
      <TabStack.Navigator initialRouteName="Profile">
        <TabStack.Screen name="Profile" component={Profile} />
      </TabStack.Navigator>
    </NavigationContainer>,
    { wrapper }
  )
  return renderAPI
}
