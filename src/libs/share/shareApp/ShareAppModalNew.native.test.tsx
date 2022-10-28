import React from 'react'

import { ShareAppModal } from 'libs/share/shareApp/shareAppModalInformations'
import { ShareAppModalNew } from 'libs/share/shareApp/ShareAppModalNew'
import { fireEvent, render } from 'tests/utils'

const visible = true
const hideModal = jest.fn()

describe('ShareAppModalNew', () => {
  it('should match underage modal snapshot when underage', () => {
    const renderAPI = render(
      <ShareAppModalNew
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModal.NOT_ELIGIBLE}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should match beneficiary modal snapshot when beneficiary', () => {
    const renderAPI = render(
      <ShareAppModalNew
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModal.BENEFICIARY}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should match booking modal snapshot when booking', () => {
    const renderAPI = render(
      <ShareAppModalNew
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModal.ON_BOOKING_SUCCESS}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should close modal when clicking on "Partager" button', () => {
    const { getByText } = render(
      <ShareAppModalNew
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModal.NOT_ELIGIBLE}
      />
    )

    const shareButton = getByText('Partager')
    fireEvent.press(shareButton)

    expect(hideModal).toBeCalledTimes(1)
  })
})
