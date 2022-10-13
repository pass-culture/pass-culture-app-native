import firestore from 'libs/firebase/shims/firestore'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { getUbbleETAMessage, useUbbleETAMessage } from './ubbleETAMessage'

jest.mock('@react-native-firebase/firestore')

describe('[method] ubbleETAMessage', () => {
  it('should call the right path: ubble > testing', () => {
    getUbbleETAMessage()
    expect(firestore().collection).toHaveBeenCalledWith('ubble')
    expect(firestore().collection('ubble').doc).toHaveBeenCalledWith('testing')
    expect(firestore().collection('ubble').doc('testing').get).toHaveBeenCalledTimes(1)
  })

  it('should retrieve the ubbleETAMessage', async () => {
    const { result } = renderHook(useUbbleETAMessage, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      // See __mocks__/@react-native-firebase/firestore
      expect(result.current.data).toEqual('Environ 1 heure')
    })
  })
})
