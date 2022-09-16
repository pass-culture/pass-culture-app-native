import React from 'react'

import { render } from 'tests/utils'
import { SlantTag } from 'ui/components/SlantTag'

describe('SlantTag', () => {
  it('should render SlantTag with automatic height and width, and padding if no height/width values are provided', () => {
    const SlantTagComponent = render(<SlantTag text={'200\u00a0€'} />)
    expect(SlantTagComponent).toMatchSnapshot()
  })

  it('should render SlantTag with provided height and width, and no padding if height/width values are provided', () => {
    const SlantTagComponent = render(<SlantTag text={'200\u00a0€'} height={20} width={40} />)
    expect(SlantTagComponent).toMatchSnapshot()
  })

  it('should render SlantTag with given angle if provided', () => {
    const SlantTagComponent = render(<SlantTag text={'200\u00a0€'} slantAngle={10} />)
    expect(SlantTagComponent).toMatchSnapshot()
  })
})
