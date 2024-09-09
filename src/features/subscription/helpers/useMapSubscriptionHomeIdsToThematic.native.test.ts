import { useMapSubscriptionHomeIdsToThematic } from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { SubscriptionTheme } from 'features/subscription/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')
useRemoteConfigContextSpy.mockReturnValue({
  ...DEFAULT_REMOTE_CONFIG,
  subscriptionHomeEntryIds: {
    [SubscriptionTheme.CINEMA]: 'cinemaId',
    [SubscriptionTheme.MUSIQUE]: 'musiqueId',
    [SubscriptionTheme.LECTURE]: 'lectureId',
    [SubscriptionTheme.SPECTACLES]: 'spectaclesId',
    [SubscriptionTheme.VISITES]: 'visiteId',
    [SubscriptionTheme.ACTIVITES]: 'activitesId',
  },
})

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('useMapSubscriptionHomeIdsToThematic', () => {
  it('should return correct theme when homeId is found in remote config', () => {
    const result = useMapSubscriptionHomeIdsToThematic('spectaclesId')

    expect(result).toEqual(SubscriptionTheme.SPECTACLES)
  })

  it('should return null when homeId is not found in remote config', () => {
    const result = useMapSubscriptionHomeIdsToThematic('otherId')

    expect(result).toBeNull()
  })
})
