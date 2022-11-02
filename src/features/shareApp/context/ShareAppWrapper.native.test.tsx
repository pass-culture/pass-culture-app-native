import { ShareAppWrapper, useShareAppContext } from 'features/shareApp/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/shareApp/helpers/shareAppModalInformations'
import { renderHook, act } from 'tests/utils'

const mockShowModal = jest.fn()
const mockShareAppModal = jest.fn()

jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
    toggleModal: jest.fn(),
  }),
}))

jest.mock('features/shareApp/components/ShareAppModalNew', () => ({
  ShareAppModalNew: ({ modalType }: { modalType: ShareAppModalType }) => {
    mockShareAppModal(modalType)
    return null
  },
}))

describe('useShareAppContext()', () => {
  it.each([
    ShareAppModalType.BENEFICIARY,
    ShareAppModalType.NOT_ELIGIBLE,
    ShareAppModalType.ON_BOOKING_SUCCESS,
  ])('should show modal with correct modal type', async (modalType) => {
    const { result } = renderShareAppHook()

    await act(async () => {
      result.current.showShareAppModal(modalType)
    })

    expect(mockShowModal).toHaveBeenCalled()
    expect(mockShareAppModal).toHaveBeenCalledWith(modalType)
  })
})

function renderShareAppHook() {
  return renderHook(useShareAppContext, {
    wrapper: ShareAppWrapper,
  })
}
