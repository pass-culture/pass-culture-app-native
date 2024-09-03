import React from 'react'

import * as Share from 'features/share/helpers/shareApp'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { ShareAppModal } from './ShareAppModal'

const visible = true
const hideModal = jest.fn()
const shareApp = jest.spyOn(Share, 'shareApp').mockResolvedValue()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('ShareAppModal', () => {
  it('should match snapshot', () => {
    render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.NOT_ELIGIBLE}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should open native share modal when clicking on "Partager l’appli" button', async () => {
    render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.NOT_ELIGIBLE}
      />
    )

    const shareButton = screen.getByTestId('Partager l’appli')
    fireEvent.press(shareButton)

    await waitFor(() => {
      expect(shareApp).toHaveBeenCalledTimes(1)
    })
  })

  it('should close modal when clicking on "Partager l’appli" button', () => {
    render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.NOT_ELIGIBLE}
      />
    )

    const shareButton = screen.getByText('Partager l’appli')
    fireEvent.press(shareButton)

    expect(hideModal).toHaveBeenCalledTimes(1)
  })

  it.each([
    ShareAppModalType.NOT_ELIGIBLE,
    ShareAppModalType.BENEFICIARY,
    ShareAppModalType.ON_BOOKING_SUCCESS,
  ])('should log analytics when clicking on "Partager l’appli" button', (modalType) => {
    render(<ShareAppModal visible={visible} hideModal={hideModal} modalType={modalType} />)

    const shareButton = screen.getByTestId('Partager l’appli')
    fireEvent.press(shareButton)

    expect(analytics.logShareApp).toHaveBeenNthCalledWith(1, { type: modalType })
  })

  it.each([
    ShareAppModalType.NOT_ELIGIBLE,
    ShareAppModalType.BENEFICIARY,
    ShareAppModalType.ON_BOOKING_SUCCESS,
  ])('should log analytics when clicking on "Fermer la modale"', (modalType) => {
    render(<ShareAppModal visible={visible} hideModal={hideModal} modalType={modalType} />)

    const closeButton = screen.getByTestId('Fermer la modale')
    fireEvent.press(closeButton)

    expect(analytics.logDismissShareApp).toHaveBeenNthCalledWith(1, modalType)
  })
})
