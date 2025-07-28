import * as shareApp from 'features/share/helpers/shareApp'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { renderHook } from 'tests/utils'

import {
  ShareAppModalSelectorViewmodelParams,
  useShareAppModalViewmodel,
} from './useShareAppModalViewmodel'

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

const mockShareApp = jest.spyOn(shareApp, 'shareApp')
mockShareApp.mockImplementation(jest.fn())

const useShareAppModalSelectorViewmodelTest = ({
  hideModal = jest.fn(),
  type: type = ShareAppModalType.BENEFICIARY,
  showModal = jest.fn(),
  setType = jest.fn(),
}: Partial<ShareAppModalSelectorViewmodelParams> = {}) => {
  const hook = renderHook(() =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useShareAppModalViewmodel({
      type,
      hideModal,
      showModal,
      setType,
    })
  )

  return hook.result.current
}

const givenRemoteConfigShareAppModalVersion = (
  version: CustomRemoteConfig['shareAppModalVersion']
) => {
  useRemoteConfigSpy.mockReturnValue({
    ...remoteConfigResponseFixture,
    data: {
      ...DEFAULT_REMOTE_CONFIG,
      shareAppModalVersion: version,
    },
  })
}

describe('useShareAppModalViewmodel', () => {
  describe('version', () => {
    test.each`
      expectedVersion
      ${'default'}
      ${'version_1'}
    `('get version $expectedVersion from remote config', async ({ expectedVersion }) => {
      givenRemoteConfigShareAppModalVersion(expectedVersion)
      const { version } = useShareAppModalSelectorViewmodelTest()

      expect(version).toEqual(expectedVersion)
    })
  })

  describe('close', () => {
    test('close modal on close', async () => {
      const hideModal = jest.fn()

      const { close } = useShareAppModalSelectorViewmodelTest({ hideModal })

      close()

      expect(hideModal).toHaveBeenCalledWith()
    })

    test.each`
      type
      ${ShareAppModalType.BENEFICIARY}
      ${ShareAppModalType.NOT_ELIGIBLE}
    `('log dismiss share app on close with type $type', async ({ type }) => {
      const { close } = useShareAppModalSelectorViewmodelTest({ type })

      close()

      expect(analytics.logDismissShareApp).toHaveBeenCalledWith(type)
    })
  })

  describe('share', () => {
    test('close modal on share', async () => {
      const hideModal = jest.fn()

      const { share } = useShareAppModalSelectorViewmodelTest({ hideModal })

      await share()

      expect(hideModal).toHaveBeenCalledWith()
    })

    test.each`
      type
      ${ShareAppModalType.BENEFICIARY}
      ${ShareAppModalType.NOT_ELIGIBLE}
    `('log share app on share with type $type', async ({ type }) => {
      const { share } = useShareAppModalSelectorViewmodelTest({ type })

      await share()

      expect(analytics.logShareApp).toHaveBeenCalledWith({ type })
    })
  })

  describe('show', () => {
    test.each`
      type
      ${ShareAppModalType.BENEFICIARY}
      ${ShareAppModalType.NOT_ELIGIBLE}
    `('show modal on show with type $type', async ({ type }) => {
      const showModal = jest.fn()
      const setType = jest.fn()
      const { show } = useShareAppModalSelectorViewmodelTest({ showModal, setType })

      show(type)

      expect(setType).toHaveBeenCalledWith(type)
      expect(showModal).toHaveBeenCalledWith()
    })

    test.each`
      type
      ${ShareAppModalType.BENEFICIARY}
      ${ShareAppModalType.NOT_ELIGIBLE}
    `('send analytics on show with $type', ({ type }) => {
      const { show } = useShareAppModalSelectorViewmodelTest()

      show(type)

      expect(analytics.logShowShareAppModal).toHaveBeenCalledWith({
        type,
      })
    })
  })
})
