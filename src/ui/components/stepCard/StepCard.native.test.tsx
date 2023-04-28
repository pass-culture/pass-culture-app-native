import React from 'react'

import { render, screen } from 'tests/utils'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'

import { StepCard } from './StepCard'

describe('<StepCard />', () => {
  it('should render title and icon', () => {
    const title = 'This is a StepCard'
    const icon = <MockIcon />
    render(<StepCard title={title} icon={icon} />)

    expect(screen.getByText(title)).toBeTruthy()
    expect(screen.getByTestId('stepcard-icon')).toBeTruthy()
  })

  it('should render subtitle', () => {
    const title = 'This is a StepCard'
    const subtitle = 'This is a subtitle'
    const icon = <MockIcon />
    render(<StepCard title={title} subtitle={subtitle} icon={icon} />)

    expect(screen.getByText(subtitle)).toBeTruthy()
  })

  it('should disable the wrapper when disabled is true', () => {
    const title = 'This is a StepCard'
    const icon = <MockIcon />
    render(<StepCard title={title} icon={icon} disabled />)

    expect(screen.getByTestId('stepcard-container')).toHaveStyle({ borderColor: '#CBCDD2' })
  })
})

const MockIcon = () => <BicolorAroundMe />
