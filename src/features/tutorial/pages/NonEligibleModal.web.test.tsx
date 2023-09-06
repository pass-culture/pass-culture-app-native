import React from 'react'

import { NonEligibleModal } from 'features/tutorial/pages/NonEligibleModal'
import { NonEligible } from 'features/tutorial/types'
import { render } from 'tests/utils/web'

describe('NonEligibleModal', () => {
  it.each(Object.values(NonEligible))('should render null in web', (modalType) => {
    const { container } = render(
      <NonEligibleModal visible hideModal={jest.fn()} modalType={modalType} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
