import React from 'react'

import { render } from 'tests/utils/web'
import { ScrollButtonForNotTouchDevice } from 'ui/components/buttons/ScrollButtonForNotTouchDevice'

describe('<ScrollButtonForNotTouchDevice />', () => {
  it('should render correctly on left direction', () => {
    const { container } = render(<ScrollButtonForNotTouchDevice top={55} horizontalAlign="left" />)

    expect(container).toMatchSnapshot()
  })

  it('should render correctly on right direction', () => {
    const { container } = render(<ScrollButtonForNotTouchDevice top={55} horizontalAlign="right" />)

    expect(container).toMatchSnapshot()
  })

  it('should render correctly when no top given', () => {
    const { container } = render(<ScrollButtonForNotTouchDevice horizontalAlign="right" />)

    expect(container).toMatchSnapshot()
  })
})
