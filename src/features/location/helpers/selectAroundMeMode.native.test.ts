import { Linking } from 'react-native'

import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { GeolocPermissionState } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import * as locationMethodsModule from 'libs/locationV2/location.methods'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { locationModalSelectors } from 'libs/locationV2/locationModal.store'

import { selectAroundMeMode } from './selectAroundMeMode'

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')

const getGeolocPositionMock = jest.mocked(getGeolocPosition)
const mockRequestGeolocPermission = jest.mocked(requestGeolocPermission)

const openSettingsSpy = jest.spyOn(Linking, 'openSettings')
const contextualRequestGeolocPermissionSpy = jest.spyOn(
  locationMethodsModule,
  'contextualRequestGeolocPermission'
)

describe('selectAroundMeMode', () => {
  describe('When permission is NEVER_ASK_AGAIN', () => {
    it('should reset place selection', async () => {
      locationActions.setPermissionState(GeolocPermissionState.NEVER_ASK_AGAIN)

      await selectAroundMeMode()

      expect(locationSelectors.selectPlace()).toBe(null)
    })

    it('should select everywhere mode', async () => {
      locationActions.setPermissionState(GeolocPermissionState.NEVER_ASK_AGAIN)

      await selectAroundMeMode()

      expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
    })

    it('should open settings when shouldOpenDirectlySettings is true', async () => {
      locationActions.setPermissionState(GeolocPermissionState.NEVER_ASK_AGAIN)
      await selectAroundMeMode({ shouldOpenDirectlySettings: true })

      expect(openSettingsSpy).toHaveBeenCalledTimes(1)
    })

    it('should call dismiss modal function when shouldOpenDirectlySettings is false', async () => {
      locationActions.setPermissionState(GeolocPermissionState.NEVER_ASK_AGAIN)
      await selectAroundMeMode({ shouldOpenDirectlySettings: false })

      expect(locationModalSelectors.selectIsVisible()).toBe(false)
    })
  })

  describe('When permission is GRANTED', () => {
    beforeEach(() => {
      mockRequestGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)
      getGeolocPositionMock.mockResolvedValue({ latitude: 48.8566, longitude: 2.3522 })
    })

    it('should select around me mode when submitting', async () => {
      locationActions.setPermissionState(GeolocPermissionState.GRANTED)
      locationActions.setGeolocPosition({ latitude: 48.8566, longitude: 2.3522 })
      await selectAroundMeMode()

      expect(locationModalSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
    })
  })

  describe('When permission is DENIED', () => {
    it('should call requestGeolocPermission', async () => {
      locationActions.setPermissionState(GeolocPermissionState.DENIED)
      void selectAroundMeMode()

      expect(contextualRequestGeolocPermissionSpy).toHaveBeenCalledTimes(1)
    })
  })
})
