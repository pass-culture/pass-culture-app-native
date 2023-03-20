import React from 'react'

import * as Share from 'features/share/helpers/shareApp'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { ShareAppModal } from './ShareAppModal'

const visible = true
const hideModal = jest.fn()
const shareApp = jest.spyOn(Share, 'shareApp').mockResolvedValue()

describe('ShareAppModal', () => {
  it('should match underage modal snapshot when underage', () => {
    render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.NOT_ELIGIBLE}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should match beneficiary modal snapshot when beneficiary', () => {
    render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.BENEFICIARY}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should match booking modal snapshot when booking', () => {
    render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.ON_BOOKING_SUCCESS}
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

    expect(hideModal).toBeCalledTimes(1)
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
