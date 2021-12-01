import firestore from '@react-native-firebase/firestore'
import { renderHook } from '@testing-library/react-hooks'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { getUbbleLoad, useUbbleLoad } from '../ubbleLoad'

jest.mock('@react-native-firebase/firestore')

describe('[method] ubbleLoad', () => {
  it('should call the right path: ubble > testing', () => {
    getUbbleLoad()
    expect(firestore().collection).toHaveBeenCalledWith('ubble')
    expect(firestore().collection('ubble').doc).toHaveBeenCalledWith('testing')
    expect(firestore().collection('ubble').doc('testing').get).toHaveBeenCalledTimes(1)
  })

  it('should retrieve the ubbleLoad', async () => {
    const { result, waitFor } = renderHook(useUbbleLoad, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => typeof result.current.data === 'number')
    // See __mocks__/@react-native-firebase/firestore
    expect(result.current.data).toEqual(34)
  })
})
