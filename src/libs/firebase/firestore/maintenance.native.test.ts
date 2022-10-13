import firestore, { FirebaseFirestoreTypes } from 'libs/firebase/shims/firestore'

import { maintenanceStatusListener } from './maintenance'

jest.mock('@react-native-firebase/firestore')

describe('[method] maintenanceStatus', () => {
  let onNext: (input: FirebaseFirestoreTypes.DocumentSnapshot) => void

  const mockedCallBack = jest.fn()

  beforeEach(() => {
    firestore()
      .collection('maintenance')
      .doc('testing')
      // @ts-expect-error is a mock
      .onSnapshot.mockImplementationOnce((localOnNext) => {
        onNext = localOnNext
      })
  })

  it('should set up listener to the maintenance feature flag', () => {
    maintenanceStatusListener(mockedCallBack)

    expect(firestore().collection).toHaveBeenCalledWith('maintenance')
    expect(firestore().collection('maintenance').doc).toHaveBeenCalledWith('testing')
    expect(firestore().collection('maintenance').doc('testing').onSnapshot).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    )
  })

  it('should set message when maintenance is on', () => {
    // @ts-expect-error is an incomplete mock
    const docSnapshot: FirebaseFirestoreTypes.DocumentSnapshot = {
      data: jest.fn().mockReturnValueOnce({
        maintenanceIsOn: true,
        message: 'Some maintenance message',
      }),
    }

    maintenanceStatusListener(mockedCallBack)
    onNext(docSnapshot)

    expect(mockedCallBack).toHaveBeenCalledWith({
      status: 'ON',
      message: 'Some maintenance message',
    })
  })

  it('should ignore the message when maintenance is off', () => {
    // @ts-expect-error is an incomplete mock
    const docSnapshot: FirebaseFirestoreTypes.DocumentSnapshot = {
      data: jest.fn().mockReturnValueOnce({
        maintenanceIsOn: false,
        message: 'Some maintenance message',
      }),
    }

    maintenanceStatusListener(mockedCallBack)
    onNext(docSnapshot)

    expect(mockedCallBack).toHaveBeenCalledWith({
      status: 'OFF',
      message: undefined,
    })
  })

  describe('when something goes wrong in firebase', () => {
    describe('should ignore the data', () => {
      it('when data is wrong', () => {
        // @ts-expect-error is an incomplete mock
        const docSnapshot: FirebaseFirestoreTypes.DocumentSnapshot = {
          data: jest.fn().mockReturnValueOnce(undefined),
        }

        maintenanceStatusListener(mockedCallBack)
        onNext(docSnapshot)

        expect(mockedCallBack).not.toBeCalled()
      })

      it('when maintenanceIsOn is wrong', () => {
        // @ts-expect-error is an incomplete mock
        const docSnapshot: FirebaseFirestoreTypes.DocumentSnapshot = {
          data: jest.fn().mockReturnValueOnce({
            maintenanceIsOn: 'something that is not a boolean',
            message: 'Some maintenance message',
          }),
        }

        maintenanceStatusListener(mockedCallBack)
        onNext(docSnapshot)

        expect(mockedCallBack).not.toBeCalled()
      })
    })

    it('should use default message when message is wrong', () => {
      // @ts-expect-error is an incomplete mock
      const docSnapshot: FirebaseFirestoreTypes.DocumentSnapshot = {
        data: jest.fn().mockReturnValueOnce({
          maintenanceIsOn: true,
          message: 42,
        }),
      }

      maintenanceStatusListener(mockedCallBack)
      onNext(docSnapshot)

      // expect(mockedCallBack).not.toBeCalled()
      expect(mockedCallBack).toHaveBeenCalledWith({
        status: 'ON',
        message:
          'L’application est actuellement en maintenance, mais sera à nouveau en ligne rapidement\u00a0!',
      })
    })
  })
})
