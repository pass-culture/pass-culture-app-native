import { Linking } from 'react-native'

import { mockLocationState } from 'features/location/fixtures/mockLocationState'
import { GeolocPermissionState } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { renderHook } from 'tests/utils'

import { useGeolocationDialogs } from './useGeolocationDialogs'

const openSettingsSpy = jest.spyOn(Linking, 'openSettings')

const mockProps = {
  ...mockLocationState,
  dismissModal: jest.fn(),
  shouldOpenDirectlySettings: false,
} as const

describe('useGeolocationDialogs', () => {
  describe('When permission is NEVER_ASK_AGAIN', () => {
    it('should reset place selection', async () => {
      const mockPropsNeverAskAgain = {
        ...mockProps,
        permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
      }
      const { result } = renderHook(() => useGeolocationDialogs(mockPropsNeverAskAgain))

      await result.current.runGeolocationDialogs()

      expect(mockProps.setPlaceGlobally).toHaveBeenNthCalledWith(1, null)
    })

    it('should select everywhere mode', async () => {
      const mockPropsNeverAskAgain = {
        ...mockProps,
        permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
      }
      const { result } = renderHook(() => useGeolocationDialogs(mockPropsNeverAskAgain))

      await result.current.runGeolocationDialogs()

      expect(mockProps.setSelectedLocationMode).toHaveBeenNthCalledWith(1, LocationMode.EVERYWHERE)
    })

    it('should open settings when shouldOpenDirectlySettings is true', async () => {
      const mockPropsSettingsTrue = {
        ...mockProps,
        permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
        shouldOpenDirectlySettings: true,
      }
      const { result } = renderHook(() => useGeolocationDialogs(mockPropsSettingsTrue))

      await result.current.runGeolocationDialogs()

      expect(openSettingsSpy).toHaveBeenCalledTimes(1)
    })

    describe('When shouldOpenDirectlySettings is false', () => {
      it('should call dismiss modal function', async () => {
        const mockPropsNeverAskAgain = {
          ...mockProps,
          permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
        }
        const { result } = renderHook(() => useGeolocationDialogs(mockPropsNeverAskAgain))

        await result.current.runGeolocationDialogs()

        expect(mockProps.dismissModal).toHaveBeenCalledTimes(1)
      })

      it('should open geoloc permission modal when current modal closed', async () => {
        const mockPropsNeverAskAgain = {
          ...mockProps,
          permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
        }
        const { result } = renderHook(() => useGeolocationDialogs(mockPropsNeverAskAgain))

        await result.current.runGeolocationDialogs()

        expect(mockProps.onModalHideRef.current).toEqual(mockProps.showGeolocPermissionModal)
      })
    })
  })

  it('should call requestGeolocPermission when permission is not NEVER_ASK_AGAIN', async () => {
    const { result } = renderHook(() => useGeolocationDialogs(mockProps))

    await result.current.runGeolocationDialogs()

    expect(mockProps.requestGeolocPermission).toHaveBeenCalledTimes(1)
  })
})
