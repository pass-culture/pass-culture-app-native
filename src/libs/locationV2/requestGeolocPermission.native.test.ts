import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { requestGeolocPermission as requestOSGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { locationSelectors } from 'libs/locationV2/location.store'
import { requestGeolocPermission } from 'libs/locationV2/requestGeolocPermission'
import { syncLocation } from 'libs/locationV2/syncLocation'

jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')
const mockRequestOSGeolocPermission = jest.mocked(requestOSGeolocPermission)

jest.mock('libs/locationV2/syncLocation')
const mockSyncLocation = jest.mocked(syncLocation)

describe('requestGeolocPermission', () => {
  it('should set permission state and sync location when permission is GRANTED', async () => {
    mockRequestOSGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    await requestGeolocPermission()

    expect(locationSelectors.selectPermissionState()).toBe(GeolocPermissionState.GRANTED)
    expect(mockSyncLocation).toHaveBeenCalledTimes(1)
  })

  it('should call onSuccess when permission is GRANTED', async () => {
    mockRequestOSGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
    const onSuccess = jest.fn()

    await requestGeolocPermission({ onSuccess })

    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('should show permission modal when permission is NEVER_ASK_AGAIN', async () => {
    mockRequestOSGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.NEVER_ASK_AGAIN)
    const onSuccess = jest.fn()

    await requestGeolocPermission({ onSuccess })

    expect(locationSelectors.selectIsPermissionModalVisible()).toBe(true)
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
