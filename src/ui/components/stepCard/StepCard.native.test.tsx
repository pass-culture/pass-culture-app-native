import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'

import { StepCard } from './StepCard'

describe('<StepCard />', () => {
  it('should render title and icon', () => {
    const title = 'This is a StepCard'

    render(<StepCard title={title} icon={<BicolorAroundMe />} />)

    expect(screen.getByText(title)).toBeTruthy()
    expect(screen.getByTestId('stepcard-icon')).toBeTruthy()
  })

  it('should render subtitle', () => {
    const title = 'This is a StepCard'
    const subtitle = 'This is a subtitle'

    render(<StepCard title={title} subtitle={subtitle} icon={<BicolorAroundMe />} />)

    expect(screen.getByText(subtitle)).toBeTruthy()
  })

  it('should disable the wrapper when disabled is true', () => {
    const title = 'This is a StepCard'

    render(<StepCard title={title} icon={<BicolorAroundMe />} disabled />)

    expect(screen.getByTestId('stepcard-container')).toHaveStyle({
      borderColor: theme.colors.greyMedium,
    })
  })

  it('should disable the title when disabled is true', () => {
    const title = 'This is a StepCard'

    render(<StepCard title={title} icon={<BicolorAroundMe />} disabled />)

    expect(screen.getByText(title)).toHaveStyle({
      color: theme.colors.greyDark,
    })
  })
})
