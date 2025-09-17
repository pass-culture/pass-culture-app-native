import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
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

  it('should automatically display icon for forced variant: BOOKCLUB', () => {
    render(<Tag label="Club" variant={TagVariant.BOOKCLUB} />)

    expect(screen.getByTestId('tagIcon')).toBeOnTheScreen()
  })

  it('should use backgroundColor from variant mapping', () => {
    render(<Tag label="Club" variant={TagVariant.BOOKCLUB} />)

    const expectedColor = theme.designSystem.color.background.bookclub

    expect(screen.getByTestId('tagWrapper')).toHaveStyle({ backgroundColor: expectedColor })
  })

  it('should use default backgroundColor when withColor prop is false', () => {
    render(<Tag label="Club" variant={TagVariant.COMING_SOON} withColor={false} />)

    const expectedColor = theme.designSystem.color.background.default

    expect(screen.getByTestId('tagWrapper')).toHaveStyle({ backgroundColor: expectedColor })
  })
})
