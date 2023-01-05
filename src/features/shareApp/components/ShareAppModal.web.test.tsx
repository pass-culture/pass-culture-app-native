import React from 'react'

import { ShareAppModal } from 'features/shareApp/components/ShareAppModal'
import { ShareAppModalType } from 'features/shareApp/helpers/shareAppModalInformations'
import { render } from 'tests/utils/web'

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
