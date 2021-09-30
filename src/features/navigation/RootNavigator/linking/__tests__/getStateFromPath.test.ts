import AsyncStorage from '@react-native-async-storage/async-storage'
import waitForExpect from 'wait-for-expect'

import { linking } from 'features/navigation/RootNavigator/linking'
import { customGetStateFromPath } from 'features/navigation/RootNavigator/linking/getStateFromPath'

const setItemSpy = jest.spyOn(AsyncStorage, 'setItem')

describe('getStateFromPath', () => {
  it('should save utm parameters in storage if available - offers', () => {
    customGetStateFromPath(
      'offre/1188?utm_campaign=push_offre_local&utm_medium=batch&utm_source=push',
      linking.config
    )

    waitForExpect(() => {
      expect(setItemSpy).toHaveBeenCalledWith('traffic_campaign', 'push_offre_local')
      expect(setItemSpy).toHaveBeenCalledWith('traffic_medium', 'batch')
      expect(setItemSpy).toHaveBeenCalledWith('traffic_source', 'push')
    })
  })

  it('should save utm parameters in storage if available - search', () => {
    customGetStateFromPath('recherche/?isDuo=true&utm_campaign=push_offre', linking.config)

    waitForExpect(() => {
      expect(setItemSpy).toHaveBeenCalledWith('traffic_campaign', 'push_offre')
    })
  })

  it('should not save utm parameters in storage if not available', () => {
    customGetStateFromPath('offre/1188?utm_campaign=&source=source', linking.config)
    waitForExpect(() => {
      expect(setItemSpy).not.toHaveBeenCalled()
    })
  })
})
