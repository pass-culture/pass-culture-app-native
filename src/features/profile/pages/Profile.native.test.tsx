import mockdate from 'mockdate'
import React, { NamedExoticComponent } from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubscriptionStepperResponseV2 } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { domains_exhausted_credit_v3 } from 'features/profile/fixtures/domainsCredit'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeoCoordinates,
  GeolocPermissionState,
  GeolocPositionError,
  GeolocationError,
} from 'libs/location'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import {
  act,
  bottomScrollEvent,
  fireEvent,
  middleScrollEvent,
  render,
  screen,
  userEvent,
} from 'tests/utils'
import * as useVersion from 'ui/hooks/useVersion'

import { Profile } from './Profile'

const GEOLOC_SWITCH = 'Interrupteur Activer ma géolocalisation'

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

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates | null
const mockPositionError = null as GeolocationError | null
const mockTriggerPositionUpdate = jest.fn()
const mockShowGeolocPermissionModal = jest.fn()

const mockUseLocation = jest.fn(() => ({
  permissionState: GeolocPermissionState.GRANTED,
  geolocPosition: DEFAULT_POSITION,
  geolocPositionError: mockPositionError,
  triggerPositionUpdate: mockTriggerPositionUpdate,
  showGeolocPermissionModal: mockShowGeolocPermissionModal,
}))
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
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

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('libs/jwt/jwt')

const useVersionSpy = jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.10.5')

const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('Profile component', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  beforeAll(() => {
    useRemoteConfigSpy.mockReturnValue({
      ...remoteConfigResponseFixture,
      data: {
        ...DEFAULT_REMOTE_CONFIG,
        displayInAppFeedback: true,
      },
    })
  })

  beforeEach(() => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.ENABLE_DEBUG_SECTION,
      RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL,
    ])
    mockServer.getApi<SubscriptionStepperResponseV2>(
      '/v2/subscription/stepper',
      subscriptionStepperFixture
    )
    mockServer.getApi('/v1/banner', {})
  })

  it('should render correctly', async () => {
    renderProfile()

    await screen.findByText('Centre d’aide')

    expect(screen).toMatchSnapshot()
  })

  it('should render offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderProfile()

    expect(screen.getByText('Pas de réseau internet')).toBeOnTheScreen()
  })

  it('should display the version with the CodePush version label', async () => {
    const mockVersion = 'Version\u00A01.10.5-123'
    useVersionSpy.mockReturnValueOnce(mockVersion)
    renderProfile()

    expect(await screen.findByText(mockVersion)).toBeOnTheScreen()
  })

  it('should not display the Code push version label when it is not available', async () => {
    renderProfile()

    expect(await screen.findByText('Version\u00A01.10.5')).toBeOnTheScreen()
  })

  describe('user settings section', () => {
    it('should navigate when the personal data row is clicked', async () => {
      renderProfile()

      const row = screen.getByText('Informations personnelles')
      await user.press(row)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'PersonalData',
      })
    })

    describe('geolocation switch', () => {
      it('should display switch ON if geoloc permission is granted', async () => {
        mockUseLocation.mockReturnValueOnce({
          permissionState: GeolocPermissionState.GRANTED,
          geolocPosition: null,
          geolocPositionError: null,
          triggerPositionUpdate: mockTriggerPositionUpdate,
          showGeolocPermissionModal: mockShowGeolocPermissionModal,
        })
        renderProfile()

        const geolocSwitch = await screen.findByTestId(GEOLOC_SWITCH)
        const positionErrorMessage = screen.queryByText(
          `La géolocalisation est temporairement inutilisable sur ton téléphone`
        )

        expect(positionErrorMessage).not.toBeOnTheScreen()
        expect(geolocSwitch.parent?.props.accessibilityState.checked).toBe(true)
      })

      it('should display position error message if geoloc permission is granted but position is null', async () => {
        mockUseLocation.mockReturnValueOnce({
          permissionState: GeolocPermissionState.GRANTED,
          geolocPosition: null,
          geolocPositionError: {
            type: GeolocPositionError.SETTINGS_NOT_SATISFIED,
            message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED],
          },
          triggerPositionUpdate: mockTriggerPositionUpdate,
          showGeolocPermissionModal: mockShowGeolocPermissionModal,
        })

        renderProfile()

        expect(
          await screen.findByText(
            GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED]
          )
        ).toBeOnTheScreen()
      })

      it('should display switch OFF if geoloc permission is denied', async () => {
        mockUseLocation.mockReturnValueOnce({
          permissionState: GeolocPermissionState.DENIED,
          geolocPosition: DEFAULT_POSITION,
          geolocPositionError: null,
          triggerPositionUpdate: mockTriggerPositionUpdate,
          showGeolocPermissionModal: mockShowGeolocPermissionModal,
        })
        renderProfile()

        const geolocSwitch = await screen.findByTestId(GEOLOC_SWITCH)

        expect(geolocSwitch.parent?.props.accessibilityState.checked).toBe(false)
      })

      it('should open "Deactivate geoloc" modal when clicking on ACTIVE switch and call mockFavoriteDispatch()', async () => {
        // geolocation switch is ON and user wants to switch it OFF
        mockUseLocation.mockReturnValueOnce({
          permissionState: GeolocPermissionState.GRANTED,
          geolocPosition: DEFAULT_POSITION,
          geolocPositionError: null,
          triggerPositionUpdate: mockTriggerPositionUpdate,
          showGeolocPermissionModal: mockShowGeolocPermissionModal,
        })
        renderProfile({
          wrapper: FavoritesWrapper,
        })

        await user.press(screen.getByTestId(GEOLOC_SWITCH))

        expect(mockFavoriteDispatch).toHaveBeenCalledWith({
          type: 'SET_SORT_BY',
          payload: 'RECENTLY_ADDED',
        })
        expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
      })
    })

    it('should navigate when the notifications row is clicked', async () => {
      renderProfile()

      const notificationsButton = screen.getByText('Notifications')
      await user.press(notificationsButton)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'NotificationsSettings',
      })
    })
  })

  describe('help section', () => {
    it('should navigate to Age Information when tutorial row is clicked, user is logged in', async () => {
      mockdate.set(CURRENT_DATE)
      renderProfile()

      const howItWorkButton = screen.getByText('Comment ça marche\u00a0?')
      await user.press(howItWorkButton)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'ProfileTutorialAgeInformationCredit',
      })
    })

    it('should navigate when the faq row is clicked', async () => {
      const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
      renderProfile()

      const faqButton = screen.getByText('Centre d’aide')
      await user.press(faqButton)

      expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK, undefined, true)
    })

    it('should display tutorial row when user is exbeneficiary', async () => {
      mockedUseAuthContext.mockImplementationOnce(() => ({
        isLoggedIn: true,
        user: { ...beneficiaryUser, depositExpirationDate: '2022-10-10T00:00:00Z' },
      }))
      renderProfile()

      expect(await screen.findByText('Comment ça marche ?')).toBeOnTheScreen()
    })

    it('should display tutorial row when user has no credit and no upcoming credit', async () => {
      mockedUseAuthContext.mockImplementationOnce(() => ({
        isLoggedIn: true,
        user: { ...beneficiaryUser, domainsCredit: domains_exhausted_credit_v3 },
      }))
      renderProfile()

      expect(await screen.findByText('Comment ça marche ?')).toBeOnTheScreen()
    })
  })

  describe('other section', () => {
    it('should navigate when the display preference row is clicked', async () => {
      renderProfile()

      const accessibilityButton = screen.getByText('Préférences d’affichage')
      await user.press(accessibilityButton)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'DisplayPreference',
      })
    })

    it('should navigate when the accessibility row is clicked', async () => {
      renderProfile()

      const accessibilityButton = screen.getByText('Accessibilité')
      await user.press(accessibilityButton)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'Accessibility',
      })
    })

    it('should navigate when the legal notices row is clicked', async () => {
      renderProfile()

      const legalNoticesButton = screen.getByText('Informations légales')
      await user.press(legalNoticesButton)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'LegalNotices',
      })
    })

    it('should display achievement section when is beneficiary user', async () => {
      mockedUseAuthContext.mockReturnValueOnce({ user: beneficiaryUser })
      renderProfile()

      await act(() => {})

      const achievementSectionTitle = await screen.findByText('Mes succès')

      expect(achievementSectionTitle).toBeOnTheScreen()
    })

    it('should go to achievements when user clicks the banner', async () => {
      mockedUseAuthContext.mockReturnValueOnce({ user: beneficiaryUser })

      renderProfile()

      const achievementBanner = await screen.findByText('Mes succès')
      await user.press(achievementBanner)

      expect(navigate).toHaveBeenCalledWith('Achievements', { from: 'profile' })
    })

    it('should not display achievement section when is not beneficiary user', async () => {
      renderProfile()

      await screen.findByText('Mon profil')

      const achievementSectionTitle = screen.queryByText('Mes succès')

      expect(achievementSectionTitle).not.toBeOnTheScreen()
    })

    it('should navigate when the feed back row is clicked', async () => {
      renderProfile()

      const legalNoticesButton = screen.getByText('Faire une suggestion')
      await user.press(legalNoticesButton)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'FeedbackInApp',
      })
    })

    it('should navigate when the confidentiality row is clicked', async () => {
      renderProfile()

      const confidentialityButton = screen.getByText('Confidentialité')
      await user.press(confidentialityButton)

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: undefined,
        screen: 'ConsentSettings',
      })
    })
  })

  describe('share app section', () => {
    it('should display banner in native', async () => {
      renderProfile()

      const shareButton = await screen.findByText('Partage le pass Culture')

      expect(shareButton).toBeOnTheScreen()
    })

    it('should share app on banner press', async () => {
      renderProfile()

      const shareButton = await screen.findByText('Partage le pass Culture')
      await user.press(shareButton)

      expect(shareSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('signout section', () => {
    it('should display signout row if the user is connected', async () => {
      renderProfile()

      const signoutButton = await screen.findByText('Déconnexion')

      expect(signoutButton).toBeOnTheScreen()
    })

    it('should NOT display signout row if the user is NOT connected', () => {
      mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: false }))
      renderProfile()

      const signoutButton = screen.queryByText('Déconnexion')

      expect(signoutButton).not.toBeOnTheScreen()
    })

    it('should delete the refreshToken, clean user profile and remove user ID from batch when pressed', async () => {
      mockedUseAuthContext.mockImplementationOnce(() => ({
        isLoggedIn: true,
        user: nonBeneficiaryUser,
      }))
      renderProfile()

      const signoutButton = screen.getByText('Déconnexion')
      await user.press(signoutButton)

      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  describe('Analytics', () => {
    it('should log event ConsultTutorial when user clicks on tutorial section', async () => {
      renderProfile()

      await user.press(screen.getByText('Comment ça marche\u00a0?'))

      expect(analytics.logConsultTutorial).toHaveBeenNthCalledWith(1, {
        age: 18,
        from: 'ProfileHelp',
      })
    })

    it('should log event ProfilScrolledToBottom when user reach end of screen', async () => {
      mockedUseAuthContext.mockImplementationOnce(() => ({
        isLoggedIn: true,
        user: nonBeneficiaryUser,
      }))
      renderProfile()

      const scrollContainer = screen.getByTestId('profile-scrollview')
      await act(async () => {
        fireEvent.scroll(scrollContainer, middleScrollEvent)
      })

      expect(analytics.logProfilScrolledToBottom).toHaveBeenCalledTimes(0)

      await act(async () => {
        fireEvent.scroll(scrollContainer, bottomScrollEvent)
      })

      expect(analytics.logProfilScrolledToBottom).toHaveBeenCalledTimes(1)
    })

    it('should log event ShareApp on share banner press', async () => {
      renderProfile()
      const banner = screen.getByText('Partage le pass Culture')

      await user.press(banner)

      expect(analytics.logShareApp).toHaveBeenNthCalledWith(1, { from: 'profile' })
    })
  })
})

interface Options {
  wrapper?: NamedExoticComponent<{ children: React.JSX.Element }> | undefined
}

const defaultOptions = {
  wrapper: undefined,
}

function renderProfile(options: Options = defaultOptions) {
  const { wrapper } = { ...defaultOptions, ...options }
  render(reactQueryProviderHOC(<Profile />), { wrapper })
}
