import React from 'react'

import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { render } from 'tests/utils/web'

import { ShareAppModal } from './ShareAppModal'

describe('ShareAppModal', () => {
  it.each([
    ShareAppModalType.NOT_ELIGIBLE,
    ShareAppModalType.BENEFICIARY,
    ShareAppModalType.ON_BOOKING_SUCCESS,
  ])('should render null in web', (modalType) => {
    const { container } = render(
      <ShareAppModal visible hideModal={jest.fn()} modalType={modalType} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
