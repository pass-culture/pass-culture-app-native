import React from 'react'

import { ShareAppModalType } from 'libs/share/shareApp/shareAppModalInformations'
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
        modalType={ShareAppModalType.UNDERAGE}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should match beneficiary modal snapshot when beneficiary', () => {
    const renderAPI = render(
      <ShareAppModalNew
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.BENEFICIARY}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should match booking modal snapshot when booking', () => {
    const renderAPI = render(
      <ShareAppModalNew
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.BOOKING}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should close modal when clicking on "Partager" button', () => {
    const { getByText } = render(
      <ShareAppModalNew
        visible={visible}
        hideModal={hideModal}
        modalType={ShareAppModalType.UNDERAGE}
      />
    )

    const shareButton = getByText('Partager')
    fireEvent.press(shareButton)

    expect(hideModal).toBeCalledTimes(1)
  })
})
