import React from 'react'

import { render, screen } from 'tests/utils'
import { Tag } from 'ui/components/Tag/Tag'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

describe('<Tag />', () => {
  it('should display label tag', () => {
    render(<Tag label="1" />)

    expect(screen.getByText('1')).toBeOnTheScreen()
  })

  it('should display icon tag when it is informed', () => {
    render(<Tag label="1" Icon={ArrowRight} />)

    expect(screen.getByTestId('tagIcon')).toBeOnTheScreen()
  })

  it('should display icon tag (JSX) when it is informed', () => {
    render(<Tag label="1" Icon={<ArrowRight />} />)

    expect(screen.getByTestId('tagIcon')).toBeOnTheScreen()
  })

  it('should not display icon tag when it is not informed', () => {
    render(<Tag label="1" />)

    expect(screen.queryByTestId('tagIcon')).not.toBeOnTheScreen()
  })
})
