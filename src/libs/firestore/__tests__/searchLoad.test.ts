import firestore from '@react-native-firebase/firestore'
import { renderHook } from '@testing-library/react-hooks'

import { getSearchLoad, useSearchLoad } from '../searchLoad'

jest.mock('@react-native-firebase/firestore')

describe('[method] searchLoad', () => {
  it('should call the right path: appsearch > testing', () => {
    getSearchLoad()
    expect(firestore().collection).toHaveBeenCalledWith('appsearch')
    expect(firestore().collection('appsearch').doc).toHaveBeenCalledWith('testing')
    expect(firestore().collection('appsearch').doc('testing').get).toHaveBeenCalledTimes(1)
  })

  it('should retrieve the searchLoad', async () => {
    const { result, waitFor } = renderHook(useSearchLoad)
    await waitFor(() => result.current !== 0)
    // See __mocks__/@react-native-firebase/firestore
    expect(result.current).toEqual(34)
  })
})
