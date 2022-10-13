import { useEnableNewIdentificationFlow } from 'libs/firebase/firestore/featureFlags/newIdentificationFlow'
import firestore from 'libs/firebase/shims/firestore'
import { renderHook, waitFor } from 'tests/utils'

import { build } from '../../../../../package.json'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

const mockGet = jest.fn()

describe('useEnableNewIdentificationFlow', () => {
  beforeAll(() =>
    collection('newIdentificationFlow')
      .doc('testing')
      // @ts-expect-error is a mock
      .get.mockResolvedValue({
        get: mockGet,
      })
  )

  it('should call the right firestore collection: featureFlags', () => {
    renderHook(() => useEnableNewIdentificationFlow())

    expect(collection).toHaveBeenCalledWith('featureFlags')
  })

  it.each`
    enableNewIdentificationFlow | minimalBuildNumber | expected
    ${false}                    | ${undefined}       | ${'disabled when firestore minimalBuildNumber is undefined'}
    ${false}                    | ${build + 1}       | ${'disabled when build number is below firestore minimalBuildNumber'}
    ${true}                     | ${build}           | ${'enabled when build number is equal to firestore minimalBuildNumber'}
    ${true}                     | ${build - 1}       | ${'enabled when build number is greater than firestore minimalBuildNumber'}
  `(
    `should be $expected`,
    async ({
      enableNewIdentificationFlow,
      minimalBuildNumber,
    }: {
      enableNewIdentificationFlow: boolean | undefined
      minimalBuildNumber: number | undefined
    }) => {
      const firestoreData = {
        minimalBuildNumber,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useEnableNewIdentificationFlow())

      await waitFor(() => {
        expect(result.current).toBe(enableNewIdentificationFlow)
      })
    }
  )
})
