import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { renderHook, waitFor } from 'tests/utils'

import { useShareAppModaleTrigger } from './useShareAppModaleTrigger'
import * as ShareAppModalStore from './useShareAppModalStore'

const TRUE_TRIGGER = () => true
const FALSE_TRIGGER = () => false
const mockShowAppModal = jest.fn()
const mockShareAppModalSeeShareAppAction = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })
const mockShareAppModalStore = jest.spyOn(ShareAppModalStore, 'useShareAppModalStore')

describe('Use Share app modale trigger', () => {
  beforeEach(() => {
    mockShareAppModalStore.mockReturnValue({
      hasSeenShareAppModal: false,
      actions: { seeShareAppModal: mockShareAppModalSeeShareAppAction },
    })
  })

  test('Modal is shown when trigger is true', async () => {
    renderHook(() => useShareAppModaleTrigger(TRUE_TRIGGER))

    await waitFor(() => {
      expect(mockShowAppModal).toHaveBeenCalled()
    })
  })

  test('Save modal seen', async () => {
    renderHook(() => useShareAppModaleTrigger(TRUE_TRIGGER))

    await waitFor(() => {
      expect(mockShareAppModalSeeShareAppAction).toHaveBeenCalled()
    })
  })

  test('Modal is NOT shown when trigger is false', async () => {
    renderHook(() => useShareAppModaleTrigger(FALSE_TRIGGER))

    await waitFor(() => {
      expect(mockShowAppModal).not.toHaveBeenCalled()
    })
  })

  test('Modal is NOT shown when shareAppModal was already shown', async () => {
    mockShareAppModalStore.mockReturnValueOnce({
      hasSeenShareAppModal: true,
      actions: { seeShareAppModal: mockShareAppModalSeeShareAppAction },
    })
    renderHook(() => useShareAppModaleTrigger(TRUE_TRIGGER))

    await waitFor(() => {
      expect(mockShowAppModal).not.toHaveBeenCalled()
    })
  })
})
