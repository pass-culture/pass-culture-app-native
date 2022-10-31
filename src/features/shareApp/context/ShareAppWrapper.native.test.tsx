import { ShareAppWrapper, useShareAppContext } from 'features/shareApp/context/ShareAppWrapper'
import { ShareAppModal } from 'libs/share/shareApp/shareAppModalInformations'
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

jest.mock('libs/share/shareApp/ShareAppModalNew', () => ({
  ShareAppModalNew: ({ modalType }: { modalType: ShareAppModal }) => {
    mockShareAppModal(modalType)
    return null
  },
}))

describe('useShareAppContext()', () => {
  it.each([
    ShareAppModal.BENEFICIARY,
    ShareAppModal.NOT_ELIGIBLE,
    ShareAppModal.ON_BOOKING_SUCCESS,
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
