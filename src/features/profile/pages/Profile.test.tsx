import { render, act, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'
import { UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { initialFavoritesState } from 'features/favorites/pages/reducer'
import * as NavigationHelpers from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { flushAllPromises } from 'tests/utils'

import { Profile } from './Profile'

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
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
  useLogoutRoutine: jest.fn(() => mockSignOut),
}))

let mockPosition: Pick<GeoCoordinates, 'latitude' | 'longitude'> | null = null
const mockTriggerPositionUpdate = jest.fn()
jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({
    position: mockPosition,
    triggerPositionUpdate: mockTriggerPositionUpdate,
  })),
}))

jest.mock('libs/storage', () => ({
  storage: {
    saveObject: jest.fn(),
  },
}))

const mockFavoritesState = initialFavoritesState
const mockFavoriteDispatch = jest.fn()
jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: mockFavoriteDispatch,
  }),
}))

describe('Profile component', () => {
  beforeEach(() => {
    navigate.mockRestore()
    jest.clearAllMocks()
  })

  describe('user settings section', () => {
    it('should navigate when the personal data row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-personal-data')
      fireEvent.press(row)

      expect(navigate).toBeCalledWith('PersonalData')
    })

    it('should navigate when the password row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-password')
      fireEvent.press(row)

      expect(navigate).toBeCalledWith('ChangePassword')
    })

    describe('geolocation switch', () => {
      it('should display switch ON if position not null', async () => {
        mockPosition = { latitude: 2, longitude: 40 }

        const { getByTestId } = await renderProfile()
        const geolocSwitch = getByTestId('geolocation-switch-background')
        expect(geolocSwitch.props.active).toBeTruthy()
      })

      it('should display switch OFF if position is null', async () => {
        mockPosition = null
        const { getByTestId } = await renderProfile()
        const geolocSwitch = getByTestId('geolocation-switch-background')
        expect(geolocSwitch.props.active).toBeFalsy()
      })

      it('should set `has_allowed_geolocation` to FALSE when clicking on ACTIVE switch and call setShouldComputePosition', async () => {
        // geolocation switch is ON and user wants to switch it OFF
        jest.spyOn(storage, 'saveObject').mockResolvedValueOnce()
        mockPosition = { latitude: 2, longitude: 40 }
        const { getByTestId } = await renderProfile({
          wrapper: FavoritesWrapper,
        })

        fireEvent.press(getByTestId('geolocation'))

        await waitForExpect(() => {
          expect(mockTriggerPositionUpdate).toHaveBeenCalled()
          expect(mockFavoriteDispatch).toBeCalledWith({
            type: 'SET_FILTER',
            payload: 'RECENTLY_ADDED',
          })
        })
        expect(storage.saveObject).toBeCalledWith('has_allowed_geolocation', false)
      })
    })
    it('should navigate when the notifications row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-notifications')
      fireEvent.press(row)

      expect(navigate).toBeCalledWith('NotificationSettings')
    })
  })

  describe('help section', () => {
    it('should navigate when the how-it-works row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-how-it-works')
      fireEvent.press(row)

      expect(navigate).toBeCalledWith('FirstTutorial')
    })

    it('should navigate when the faq row is clicked', async () => {
      const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-faq')
      fireEvent.press(row)

      expect(openExternalUrl).toBeCalledWith('https://aide.passculture.app/fr/')
    })
  })

  describe('other section', () => {
    it('should navigate when the accessibility row is clicked', async () => {
      const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-accessibility')
      fireEvent.press(row)

      expect(openExternalUrl).toBeCalledWith('https://pass.culture.fr/accessibilite-de-la-webapp/')
    })

    it('should navigate when the legal notices row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-legal-notices')
      fireEvent.press(row)

      expect(navigate).toBeCalledWith('LegalNotices')
    })

    it('should navigate when the confidentiality row is clicked', async () => {
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-confidentiality')
      fireEvent.press(row)

      expect(navigate).toBeCalledWith('ConsentSettings')
    })
  })

  describe('signout section', () => {
    it('should display signout row if the user is connected', async () => {
      const { getByTestId } = await renderProfile()
      const row = getByTestId('row-signout')
      expect(row).toBeTruthy()
    })

    it('should NOT display signout row if the user is NOT connected', async () => {
      mockedUseAuthContext.mockImplementation(() => ({ isLoggedIn: false }))
      const { queryByTestId } = await renderProfile()
      const row = queryByTestId('row-signout')
      expect(row).toBeFalsy()
    })

    it('should delete the refreshToken, clean user profile and remove user ID from batch when pressed', async () => {
      mockedUseAuthContext.mockImplementation(() => ({ isLoggedIn: true }))
      const { getByTestId } = await renderProfile()

      const row = getByTestId('row-signout')
      fireEvent.press(row)

      expect(analytics.logLogout).toBeCalled()
      expect(mockSignOut).toBeCalled()
    })
  })
})

interface Options {
  wrapper?: (({ children }: { children: Element }) => JSX.Element) | undefined
}

const defaultOptions = {
  wrapper: undefined,
}

async function renderProfile(options: Options = defaultOptions) {
  const { wrapper } = { ...defaultOptions, ...options }
  const renderAPI = render(<Profile />, { wrapper })
  await act(flushAllPromises)
  return renderAPI
}
