import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { GeoCoordinates, PositionError } from 'react-native-geolocation-service'
import { UseQueryResult } from 'react-query'

import { GetIdCheckTokenResponse, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import * as NavigationHelpers from 'features/navigation/helpers'
import { Tab } from 'features/navigation/TabBar/TabNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { GeolocPermissionState } from 'libs/geolocation'
import { GeolocationError, GEOLOCATION_USER_ERROR_MESSAGE } from 'libs/geolocation/getPosition'
import { flushAllPromises, render, act, fireEvent } from 'tests/utils'

import { Profile } from './Profile'

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  // @ts-ignore : Spread types may only be created from object types.
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}))

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(
    () =>
      ({
        isLoading: false,
        data: { email: 'email2@domain.ext', firstName: 'Jean', isBeneficiary: false },
      } as UseQueryResult<UserProfileResponse>)
  ),
}))

const mockedUseAuthContext = useAuthContext as jest.Mock
const mockSignOut = jest.fn()
const mockSignOutFromIdCheck = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
  useIdCheckLogoutRoutine: jest.fn(() => mockSignOutFromIdCheck.mockResolvedValueOnce(jest.fn())),
}))

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates
let mockPermissionState = GeolocPermissionState.GRANTED
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
let mockPositionError: GeolocationError | null = null
const mockTriggerPositionUpdate = jest.fn()
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    position: mockPosition,
    positionError: mockPositionError,
    triggerPositionUpdate: mockTriggerPositionUpdate,
  }),
}))

const mockFavoritesState = initialFavoritesState
const mockFavoriteDispatch = jest.fn()
jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: mockFavoriteDispatch,
  }),
}))
const mockDepositAmount = '300 €'
jest.mock('features/auth/api', () => ({
  useGetIdCheckToken: jest.fn(
    () =>
      ({
        isLoading: false,
        data: { token: 'thisIsATokenForIdCheck' },
      } as UseQueryResult<GetIdCheckTokenResponse>)
  ),
  useDepositAmount: () => mockDepositAmount,
}))
jest.mock('features/auth/settings')

describe('Profile component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterEach(() => {
    mockPermissionState = GeolocPermissionState.GRANTED
    mockPosition = DEFAULT_POSITION
    mockPositionError = null
  })

  describe('user settings section', () => {
    it('should navigate when the personal data row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-personal-data')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('PersonalData')
    })

    it('should navigate when the password row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-password')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('ChangePassword')
    })

    describe('geolocation switch', () => {
      it('should display switch ON if geoloc permission is granted', async () => {
        mockPermissionState = GeolocPermissionState.GRANTED

        const { getByTestId, queryByText } = await renderProfile()
        const geolocSwitch = getByTestId('geolocation')
        const positionErrorMessage = queryByText(
          `La géolocalisation est temporairement inutilisable sur ton téléphone`
        )
        expect(positionErrorMessage).toBeFalsy()
        expect(geolocSwitch.parent?.props.accessibilityValue.text).toBe('true')
      })

      it('should display position error message if geoloc permission is granted but position is null', async () => {
        mockPermissionState = GeolocPermissionState.GRANTED
        mockPosition = null
        mockPositionError = {
          type: PositionError.SETTINGS_NOT_SATISFIED,
          message: GEOLOCATION_USER_ERROR_MESSAGE[PositionError.SETTINGS_NOT_SATISFIED],
        }

        const { getByText } = await renderProfile()
        getByText(mockPositionError.message)
      })

      it('should display switch OFF if geoloc permission is denied', async () => {
        mockPermissionState = GeolocPermissionState.DENIED
        const { getByTestId } = await renderProfile()
        const geolocSwitch = getByTestId('geolocation')
        expect(geolocSwitch.parent?.props.accessibilityValue.text).toBe('false')
      })

      it('should open "Deactivate geoloc" modal when clicking on ACTIVE switch and call mockFavoriteDispatch()', async () => {
        // geolocation switch is ON and user wants to switch it OFF
        mockPermissionState = GeolocPermissionState.GRANTED
        const { getByTestId, getByText } = await renderProfile({
          wrapper: FavoritesWrapper,
        })

        fireEvent.press(getByTestId('geolocation'))

        expect(mockFavoriteDispatch).toBeCalledWith({
          type: 'SET_SORT_BY',
          payload: 'RECENTLY_ADDED',
        })
        expect(getByTestId('modal-geoloc-permission-modal').props.visible).toBe(true)
        expect(getByText('Désactiver la géolocalisation'))
      })
    })
    it('should navigate when the notifications row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-notifications')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('NotificationSettings')
    })
  })

  describe('help section', () => {
    it('should navigate when the how-it-works row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-how-it-works')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('FirstTutorial', { shouldCloseAppOnBackAction: false })
    })

    it('should navigate when the faq row is clicked', async () => {
      const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-faq')
      fireEvent.press(row)

      expect(openExternalUrl).toBeCalledWith(env.FAQ_LINK)
    })
    it('should navigate when the how-import-deeplink row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-import-deeplink')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('DeeplinkImporter')
    })
  })

  describe('other section', () => {
    it('should navigate when the accessibility row is clicked', async () => {
      const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-accessibility')
      fireEvent.press(row)

      expect(openExternalUrl).toBeCalledWith(env.ACCESSIBILITY_LINK)
    })

    it('should navigate when the legal notices row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-legal-notices')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('LegalNotices')
    })

    it('should navigate when the confidentiality row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-confidentiality')
      fireEvent.press(row)

      expect(mockNavigate).toBeCalledWith('ConsentSettings')
    })
  })

  describe('signout section', () => {
    it('should display signout row if the user is connected', async () => {
      const { getByTestId } = await renderProfile()
      const row = getByTestId('Déconnexion')
      expect(row).toBeTruthy()
    })

    it('should NOT display signout row if the user is NOT connected', async () => {
      // eslint-disable-next-line local-rules/independant-mocks
      mockedUseAuthContext.mockImplementation(() => ({ isLoggedIn: false }))
      const { queryByTestId } = await renderProfile()
      const row = queryByTestId('Déconnexion')
      expect(row).toBeFalsy()
    })

    it('should delete the refreshToken, clean user profile and remove user ID from batch when pressed', async () => {
      // eslint-disable-next-line local-rules/independant-mocks
      mockedUseAuthContext.mockImplementation(() => ({ isLoggedIn: true }))
      const { getByTestId } = await renderProfile()

      const row = getByTestId('Déconnexion')
      fireEvent.press(row)

      expect(mockSignOut).toBeCalled()
    })
  })

  describe('Analytics', () => {
    it('should log event ProfilScrolledToBottom when user reach end of screen', async () => {
      // eslint-disable-next-line local-rules/independant-mocks
      mockedUseAuthContext.mockImplementation(() => ({ isLoggedIn: true }))
      const { getByTestId } = await renderProfile()
      const scrollContainer = getByTestId('profile-scrollview')
      await act(async () => await fireEvent.scroll(scrollContainer, middleScrollEvent))
      expect(analytics.logProfilScrolledToBottom).toBeCalledTimes(0)
      await act(async () => await fireEvent.scroll(scrollContainer, bottomScrollEvent))
      expect(analytics.logProfilScrolledToBottom).toBeCalledTimes(1)
    })
  })
})

const middleScrollEvent = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 },
    contentSize: { height: 1600 },
  },
}

const bottomScrollEvent = {
  nativeEvent: {
    contentOffset: { y: 1600 },
    layoutMeasurement: { height: 1600 },
    contentSize: { height: 1600 },
  },
}

interface Options {
  wrapper?: (({ children }: { children: JSX.Element }) => JSX.Element) | undefined
}

const defaultOptions = {
  wrapper: undefined,
}

async function renderProfile(options: Options = defaultOptions) {
  const { wrapper } = { ...defaultOptions, ...options }
  const renderAPI = render(
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Profile">
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>,
    { wrapper }
  )
  await act(flushAllPromises)
  return renderAPI
}
