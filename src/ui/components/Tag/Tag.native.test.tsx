import React from 'react'

import { render, screen } from 'tests/utils'
import { Tag } from 'ui/components/Tag/Tag'
import { Camera } from 'ui/svg/icons/Camera'

describe('<Tag />', () => {
  it('should display label tag', () => {
    render(<Tag label="1" />)

    expect(screen.getByText('1')).toBeOnTheScreen()
  })

  it('should display icon tag when it is informed', () => {
    render(<Tag label="1" Icon={Camera} />)

    expect(screen.getByTestId('tagIcon')).toBeOnTheScreen()
  })

  it('should not display icon tag when it is not informed', () => {
    render(<Tag label="1" />)

    expect(screen.queryByTestId('tagIcon')).not.toBeOnTheScreen()
  })
})
