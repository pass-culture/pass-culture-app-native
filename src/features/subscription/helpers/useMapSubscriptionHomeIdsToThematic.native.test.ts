import { useMapSubscriptionHomeIdsToThematic } from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { SubscriptionTheme } from 'features/subscription/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'

jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery').mockReturnValue({
  ...remoteConfigResponseFixture,
  data: {
    ...DEFAULT_REMOTE_CONFIG,
    subscriptionHomeEntryIds: {
      [SubscriptionTheme.CINEMA]: 'cinemaId',
      [SubscriptionTheme.MUSIQUE]: 'musiqueId',
      [SubscriptionTheme.LECTURE]: 'lectureId',
      [SubscriptionTheme.SPECTACLES]: 'spectaclesId',
      [SubscriptionTheme.VISITES]: 'visiteId',
      [SubscriptionTheme.ACTIVITES]: 'activitesId',
    },
  },
})

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
