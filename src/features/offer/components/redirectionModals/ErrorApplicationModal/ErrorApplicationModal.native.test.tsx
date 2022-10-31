import React from 'react'

import { ErrorApplicationModal } from 'features/offer/components/redirectionModals/ErrorApplicationModal/ErrorApplicationModal'
import { render } from 'tests/utils'

const hideModal = jest.fn()

describe('<AuthenticationModal />', () => {
  it('should match previous snapshot', () => {
    const modal = render(<ErrorApplicationModal visible hideModal={hideModal} />)
    expect(modal).toMatchSnapshot()
  })
})
