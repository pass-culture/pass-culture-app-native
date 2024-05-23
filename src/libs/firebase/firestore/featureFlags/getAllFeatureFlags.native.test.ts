import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import firestore from 'libs/firebase/shims/firestore'
import { renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

describe('getAllFeatureFlags', () => {
  it('should call the right firestore collection: featureFlags', () => {
    renderHook(getAllFeatureFlags)

    expect(collection).toHaveBeenCalledWith('featureFlags')
  })
})
