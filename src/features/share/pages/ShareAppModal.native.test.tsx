import React from 'react'
import waitForExpect from 'wait-for-expect'

import * as Share from 'features/share/helpers/shareApp'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { ShareAppModal } from './ShareAppModal'

const visible = true
const hideModal = jest.fn()
const shareApp = jest.spyOn(Share, 'shareApp').mockResolvedValue()

describe('ShareAppModal', () => {
  it('should match underage modal snapshot when underage', () => {
    const renderAPI = render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.NOT_ELIGIBLE}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should match beneficiary modal snapshot when beneficiary', () => {
    const renderAPI = render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.BENEFICIARY}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should match booking modal snapshot when booking', () => {
    const renderAPI = render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.ON_BOOKING_SUCCESS}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should open native share modal when clicking on "Partager l’appli" button', async () => {
    const { getByTestId } = render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.NOT_ELIGIBLE}
      />
    )

    const shareButton = getByTestId('Partager l’appli')
    fireEvent.press(shareButton)

    await waitForExpect(() => {
      expect(shareApp).toHaveBeenCalledTimes(1)
    })
  })

  it('should close modal when clicking on "Partager l’appli" button', () => {
    const { getByText } = render(
      <ShareAppModal
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.NOT_ELIGIBLE}
      />
    )

    const shareButton = getByText('Partager l’appli')
    fireEvent.press(shareButton)

    expect(hideModal).toBeCalledTimes(1)
  })

  it.each([
    ShareAppModalType.NOT_ELIGIBLE,
    ShareAppModalType.BENEFICIARY,
    ShareAppModalType.ON_BOOKING_SUCCESS,
  ])('should log analytics when clicking on "Partager l’appli" button', (modalType) => {
    const { getByTestId } = render(
      <ShareAppModal visible={visible} hideModal={hideModal} modalType={modalType} />
    )

    const shareButton = getByTestId('Partager l’appli')
    fireEvent.press(shareButton)

    expect(analytics.logShareApp).toHaveBeenNthCalledWith(1, { type: modalType })
  })

  it.each([
    ShareAppModalType.NOT_ELIGIBLE,
    ShareAppModalType.BENEFICIARY,
    ShareAppModalType.ON_BOOKING_SUCCESS,
  ])('should log analytics when clicking on "Fermer la modale"', (modalType) => {
    const { getByTestId } = render(
      <ShareAppModal visible={visible} hideModal={hideModal} modalType={modalType} />
    )

    const closeButton = getByTestId('Fermer la modale')
    fireEvent.press(closeButton)

    expect(analytics.logDismissShareApp).toHaveBeenNthCalledWith(1, modalType)
  })
})
