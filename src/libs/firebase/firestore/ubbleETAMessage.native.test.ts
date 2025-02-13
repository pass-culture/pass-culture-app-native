import firestore from 'libs/firebase/shims/firestore'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { getUbbleETAMessage, useUbbleETAMessage } from './ubbleETAMessage'

jest.mock('@react-native-firebase/firestore')

describe('[method] ubbleETAMessage', () => {
  it('should call the right path: ubble > testing', () => {
    getUbbleETAMessage()

    expect(firestore().collection).toHaveBeenCalledWith('root')
    expect(firestore().collection('root').doc).toHaveBeenCalledWith('ubble')
    expect(firestore().collection('root').doc('ubble').get).toHaveBeenCalledTimes(1)
  })

  it('should retrieve the ubbleETAMessage', async () => {
    const { result } = renderHook(useUbbleETAMessage, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {})

    // See __mocks__/@react-native-firebase/firestore
    expect(result.current.data).toEqual('Environ 1 heure')
  })
})
