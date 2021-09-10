import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import { maintenanceStatusListener } from '../maintenance'

jest.mock('@react-native-firebase/firestore')

describe('remoteStore', () => {
  describe('[method] maintenanceStatus', () => {
    let onNext: (input: FirebaseFirestoreTypes.DocumentSnapshot) => void

    firestore()
      .collection('maintenance')
      .doc('testing')
      // @ts-expect-error is a mock
      .onSnapshot.mockImplementationOnce((localOnNext) => {
        onNext = localOnNext
      })
    const mockedCallBack = jest.fn()

    it('should set up listener to the maintenance feature flag', () => {
      maintenanceStatusListener(mockedCallBack)
      expect(firestore().collection).toHaveBeenCalledWith('maintenance')
      expect(firestore().collection('maintenance').doc).toHaveBeenCalledWith('testing')
      expect(firestore().collection('maintenance').doc('testing').onSnapshot).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      )
    })

    it('should set up listener with given callback', () => {
      const get = jest.fn().mockReturnValue('getReturn')
      // @ts-expect-error is an incomplete mock
      const docSnapshot: FirebaseFirestoreTypes.DocumentSnapshot = { get }
      onNext(docSnapshot)
      expect(get).toHaveBeenCalledWith('maintenanceIsOn')
      expect(mockedCallBack).toHaveBeenCalledWith('getReturn')
    })
  })
})
