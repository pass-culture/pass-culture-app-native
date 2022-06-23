import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { View, Text } from 'react-native'
import { UseQueryOptions } from 'react-query'
import { QueryFunction } from 'react-query/types/core/types'
import waitForExpect from 'wait-for-expect'

import { eventMonitoring } from 'libs/monitoring'
import { useNetInfo as useNetInfoDefault } from 'libs/network/useNetInfo'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, superFlushWithAct } from 'tests/utils'

import { usePersistQuery } from '../usePersistQuery'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfo = useNetInfoDefault as jest.Mock

type TestData = {
  id: number
  description: string
}

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({
  error: true,
})

describe('usePersistQuery', () => {
  const queryKey = 'TestData'
  const offlineData: TestData[] = [
    {
      id: 1,
      description: 'maverick',
    },
    {
      id: 2,
      description: 'leon',
    },
  ]

  const additionalData: TestData[] = [{ id: 3, description: 'sierra' }]

  const onlineData: TestData[] = [...offlineData, ...additionalData]

  const queryFn: QueryFunction<TestData[]> = async () => onlineData

  mockUseNetInfo.mockReturnValue({ isConnected: true })

  afterEach(async () => {
    await AsyncStorage.removeItem(queryKey)
  })

  describe('without initial local data', () => {
    it('should save distant data locally', async () => {
      let persistDataStr = await AsyncStorage.getItem(queryKey)
      expect(persistDataStr).toBeFalsy()

      renderUsePersistQuery({ queryKey, queryFn })

      await superFlushWithAct()
      await waitForExpect(async () => {
        persistDataStr = await AsyncStorage.getItem(queryKey)
        expect(persistDataStr).toBeTruthy()
        if (typeof persistDataStr === 'string') {
          expect(JSON.parse(persistDataStr)).toEqual(onlineData)
        }
      })
    })

    it('should fail to save distant data locally and log to sentry', async () => {
      const error = new Error('WRITING_REJECTED')
      let persistDataStr = await AsyncStorage.getItem(queryKey)
      expect(persistDataStr).toBeFalsy()
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(error)

      renderUsePersistQuery({ queryKey, queryFn })

      await superFlushWithAct()
      await waitForExpect(async () => {
        persistDataStr = await AsyncStorage.getItem(queryKey)
        expect(persistDataStr).toBeFalsy()
        expect(eventMonitoring.captureException).toBeCalledWith(error, {
          context: { queryKey, data: onlineData },
        })
      })
    })
  })

  describe('with initial local data', () => {
    beforeEach(async () => {
      await AsyncStorage.setItem(queryKey, JSON.stringify(offlineData))
    })

    it('should show offline data first, then online data', async () => {
      const persistDataStr = await AsyncStorage.getItem(queryKey)
      expect(persistDataStr).toBeTruthy()

      renderUsePersistQuery({ queryKey, queryFn })

      expect(await AsyncStorage.getItem(queryKey)).toEqual(JSON.stringify(offlineData))
      await superFlushWithAct()
      expect(await AsyncStorage.getItem(queryKey)).toEqual(JSON.stringify(onlineData))
    })

    it('should fail to read local data and log to sentry', async () => {
      const error = new Error('READING_REJECTED')
      const persistDataStr = await AsyncStorage.getItem(queryKey)
      expect(persistDataStr).toBeTruthy()
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(error)

      renderUsePersistQuery({ queryKey, queryFn })

      await superFlushWithAct()
      await waitForExpect(async () => {
        expect(eventMonitoring.captureException).toBeCalledWith(error, {
          context: { queryKey },
        })
      })
    })
  })
})

function TestApp({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: string
  queryFn: QueryFunction<TestData[]>
  options?: Omit<UseQueryOptions<TestData[]>, 'queryKey'>
}) {
  const query = usePersistQuery<TestData[]>(queryKey, queryFn, options)
  return (
    <View>
      <Text>isOfflineData: {query.isOfflineData}</Text>
    </View>
  )
}

function renderUsePersistQuery({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: string
  queryFn: QueryFunction<TestData[]>
  options?: Omit<UseQueryOptions<TestData[]>, 'queryKey'>
}) {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<TestApp queryKey={queryKey} queryFn={queryFn} options={options} />)
  )
}
