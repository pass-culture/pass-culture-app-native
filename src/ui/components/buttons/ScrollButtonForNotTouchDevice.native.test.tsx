import React from 'react'

import { render, screen } from 'tests/utils'
import { ScrollButtonForNotTouchDevice } from 'ui/components/buttons/ScrollButtonForNotTouchDevice'

describe('<ScrollButtonForNotTouchDevice />', () => {
  it('should render correctly on left direction', () => {
    render(<ScrollButtonForNotTouchDevice top={55} horizontalAlign="left" />)

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly on right direction', () => {
    render(<ScrollButtonForNotTouchDevice top={55} horizontalAlign="right" />)

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when no top given', () => {
    render(<ScrollButtonForNotTouchDevice horizontalAlign="right" />)

    expect(screen).toMatchSnapshot()
  })
})
