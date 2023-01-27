import { Platform } from 'react-native'
import * as Permissions from 'react-native-permissions'

import { storage } from 'libs/storage'
import { renderHook, act } from 'tests/utils'

import { PushNotificationsWrapper, usePushNotificationsContext } from './PushNotificationsWrapper'

const PUSH_NOTIFICATIONS_STORAGE_KEY = 'has_seen_push_notifications_modal_once'

jest.mock('features/notifications/pages/AskNotificationsModal', () => ({
  AskNotificiationsModal: () => null,
}))

const mockDefaultPlatform = { OS: 'ios', Version: '15.2' }
jest.mock('react-native/Libraries/Utilities/Platform', () => mockDefaultPlatform)

const mockCheckNotifications = jest
  .spyOn(Permissions, 'checkNotifications')
  .mockResolvedValue({ status: Permissions.RESULTS.DENIED, settings: {} })

describe('usePushNotificationsContext()', () => {
  describe('Showing modal for the first time', () => {
    beforeEach(async () => {
      await storage.clear(PUSH_NOTIFICATIONS_STORAGE_KEY)
      jest.restoreAllMocks()
    })

    it.each`
      os           | version   | shouldShowModal
      ${'ios'}     | ${'13.0'} | ${true}
      ${'ios'}     | ${'15.2'} | ${true}
      ${'android'} | ${32}     | ${false}
      ${'android'} | ${33}     | ${true}
      ${'android'} | ${34}     | ${true}
    `(
      'should show modal for iOS and Android SDK 33+',
      async (params: {
        os: 'ios' | 'android'
        version: number | string
        shouldShowModal: boolean
      }) => {
        Platform.OS = params.os
        Platform.Version = params.version

        const { result } = renderPushNotificationsHook()

        await act(async () => {
          await result.current.showPushNotificationsModalForFirstTime()
        })

        expect(result.current.isPushNotificationsModalVisible).toBe(params.shouldShowModal)
      }
    )

    it('should not show modal if permission is already granted', async () => {
      mockCheckNotifications.mockResolvedValueOnce({
        status: Permissions.RESULTS.GRANTED,
        settings: {},
      })
      const { result } = renderPushNotificationsHook()

      await act(async () => {
        await result.current.showPushNotificationsModalForFirstTime()
      })

      expect(result.current.isPushNotificationsModalVisible).toBeFalsy()
    })

    it('should update local storage to indicate that modal has been shown once', async () => {
      const { result } = renderPushNotificationsHook()

      await act(async () => {
        await result.current.showPushNotificationsModalForFirstTime()
      })

      const hasSeenModalOnce = await storage.readObject(PUSH_NOTIFICATIONS_STORAGE_KEY)
      expect(hasSeenModalOnce).toBeTruthy()
    })
  })

  describe('Already showed modal once', () => {
    beforeAll(async () => {
      await storage.saveObject(PUSH_NOTIFICATIONS_STORAGE_KEY, true)
    })

    it('should not show modal when calling showPushNotificationsModalForFirstTime', async () => {
      const { result } = renderPushNotificationsHook()

      await act(async () => {
        await result.current.showPushNotificationsModalForFirstTime()
      })

      expect(result.current.isPushNotificationsModalVisible).toBeFalsy()
    })
  })
})

function renderPushNotificationsHook() {
  return renderHook(usePushNotificationsContext, {
    wrapper: PushNotificationsWrapper,
  })
}
