import React from 'react'

import { render } from 'tests/utils'
import { ScrollButtonForNotTouchDevice } from 'ui/components/buttons/ScrollButtonForNotTouchDevice'

describe('<ScrollButtonForNotTouchDevice />', () => {
  it('should render correctly on left direction', () => {
    const renderAPI = render(<ScrollButtonForNotTouchDevice top={55} horizontalAlign="left" />)
    expect(renderAPI).toMatchSnapshot()
  })
  it('should render correctly on right direction', () => {
    const renderAPI = render(<ScrollButtonForNotTouchDevice top={55} horizontalAlign="right" />)
    expect(renderAPI).toMatchSnapshot()
  })
  it('should render correctly when no top given', () => {
    const renderAPI = render(<ScrollButtonForNotTouchDevice horizontalAlign="right" />)
    expect(renderAPI).toMatchSnapshot()
  })
})
