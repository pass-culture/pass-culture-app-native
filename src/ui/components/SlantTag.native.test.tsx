import React from 'react'

import { render, screen } from 'tests/utils'
import { SlantTag } from 'ui/components/SlantTag'

describe('SlantTag', () => {
  it('should render SlantTag with automatic height and width, and padding if no height/width values are provided', () => {
    render(<SlantTag text="200&nbsp;€" />)
    expect(screen).toMatchSnapshot()
  })

  it('should render SlantTag with provided height and width, and no padding if height/width values are provided', () => {
    render(<SlantTag text="200&nbsp;€" height={20} width={40} />)
    expect(screen).toMatchSnapshot()
  })

  it('should render SlantTag with given angle if provided', () => {
    render(<SlantTag text="200&nbsp;€" slantAngle={10} />)
    expect(screen).toMatchSnapshot()
  })
})
