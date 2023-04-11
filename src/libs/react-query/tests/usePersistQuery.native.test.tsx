import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryFunction } from 'react-query/types/core/types'

import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromisesWithAct, renderHook, waitFor } from 'tests/utils'

import { usePersistQuery } from '../usePersistQuery'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

type TestData = {
  id: number
  description: string
}

const offlineData: TestData[] = [
  { id: 1, description: 'maverick' },
  { id: 2, description: 'leon' },
]

const queryKey = 'TestData'
const queryFn: QueryFunction<TestData[]> = async () => onlineData
const additionalData: TestData[] = [{ id: 3, description: 'sierra' }]
const onlineData: TestData[] = [...offlineData, ...additionalData]

mockUseNetInfoContext.mockReturnValue({ isConnected: true })

describe('usePersistQuery', () => {
  beforeEach(async () => await AsyncStorage.removeItem(queryKey))

  describe('without initial local data', () => {
    it('should save distant data locally', async () => {
      renderHook(() => usePersistQuery(queryKey, queryFn), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await flushAllPromisesWithAct()

      const persistDataStr = await AsyncStorage.getItem(queryKey)
      expect(persistDataStr).toBeTruthy()
      if (typeof persistDataStr === 'string') {
        expect(JSON.parse(persistDataStr)).toEqual(onlineData)
      }
    })

    it('should fail to save distant data locally and log to sentry', async () => {
      const error = new Error('WRITING_REJECTED')
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(error)
      renderHook(() => usePersistQuery(queryKey, queryFn), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await flushAllPromisesWithAct()

      const persistDataStr = await AsyncStorage.getItem(queryKey)
      expect(persistDataStr).toBeFalsy()
      expect(eventMonitoring.captureException).toBeCalledWith(error, {
        context: { queryKey, data: onlineData },
      })
    })
  })

  describe('with initial local data', () => {
    beforeEach(async () => {
      // Console error displayed when offline mode
      jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)
      await AsyncStorage.setItem(queryKey, JSON.stringify(offlineData))
    })

    it('should show offline data first, then online data', async () => {
      const persistDataStr = await AsyncStorage.getItem(queryKey)
      expect(persistDataStr).toBeTruthy()
      renderHook(() => usePersistQuery(queryKey, queryFn), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      // Console error displayed when offline mode
      jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)
      expect(await AsyncStorage.getItem(queryKey)).toEqual(JSON.stringify(offlineData))

      await flushAllPromisesWithAct()

      expect(await AsyncStorage.getItem(queryKey)).toEqual(JSON.stringify(onlineData))
    })

    it('should fail to read local data and log to sentry', async () => {
      const error = new Error('READING_REJECTED')
      const persistDataStr = await AsyncStorage.getItem(queryKey)
      expect(persistDataStr).toBeTruthy()
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(error)
      renderHook(() => usePersistQuery(queryKey, queryFn), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await flushAllPromisesWithAct()

      expect(eventMonitoring.captureException).toBeCalledWith(error, {
        context: { queryKey },
      })
    })

    describe('react-query option.select support', () => {
      it('should return defined when select find the entity', async () => {
        let cursor: TestData | null = null

        renderHook(
          () =>
            usePersistQuery(queryKey, queryFn, {
              // @ts-ignore cast for select occur on return
              select(data) {
                cursor = data.find((item) => item.id === offlineData[1].id) as TestData
                return cursor
              },
            }),
          {
            // eslint-disable-next-line local-rules/no-react-query-provider-hoc
            wrapper: ({ children }) => reactQueryProviderHOC(children),
          }
        )

        await waitFor(() => {
          expect(cursor).toEqual(offlineData[1])
        })
      })
    })
  })
})
