import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { StepButtonState } from 'ui/components/StepButton/types'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'

import { StepCard } from './StepCard'

describe('<StepCard />', () => {
  const title = 'This is a StepCard'
  const subtitle = 'This is a subtitle'

  it('should render title and icon', () => {
    render(<StepCard title={title} icon={<BicolorAroundMe />} />)

    expect(screen.getByText(title)).toBeOnTheScreen()
    expect(screen.getByTestId('stepcard-icon')).toBeOnTheScreen()
  })

  it('should render subtitle', () => {
    render(<StepCard title={title} subtitle={subtitle} icon={<BicolorAroundMe />} />)

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  it('should return the wrapper greyMedium when type is StepButtonState.DISABLED', () => {
    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepButtonState.DISABLED} />)

    expect(screen.getByTestId('stepcard-container')).toHaveStyle({
      borderColor: theme.colors.greyMedium,
    })
  })

  it('should return the wrapper greyDark when type is StepButtonState.COMPLETED', () => {
    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepButtonState.COMPLETED} />)

    expect(screen.getByTestId('stepcard-container')).toHaveStyle({
      borderColor: theme.colors.greyDark,
    })
  })

  it('should return the title greyDark when type is StepButtonState.DISABLED', () => {
    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepButtonState.DISABLED} />)

    expect(screen.getByText(title)).toHaveStyle({
      color: theme.colors.greyDark,
    })
  })

  it('should return the title black when type is StepButtonState.CURRENT', () => {
    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepButtonState.CURRENT} />)

    expect(screen.getByText(title)).toHaveStyle({
      color: theme.colors.black,
    })
  })

  it('should return the title greyDark when type is StepButtonState.COMPLETED', () => {
    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepButtonState.COMPLETED} />)

    expect(screen.getByText(title)).toHaveStyle({
      color: theme.colors.greyDark,
    })
  })

  it('should return the subtitle greyDark when type is StepButtonState.CURRENT', () => {
    render(
      <StepCard
        title={title}
        subtitle={subtitle}
        icon={<BicolorAroundMe />}
        type={StepButtonState.CURRENT}
      />
    )

    expect(screen.getByText(subtitle)).toHaveStyle({
      color: theme.colors.greyDark,
    })
  })

  it('should not return the subtitle when type is StepButtonState.COMPLETED', () => {
    render(
      <StepCard
        title={title}
        subtitle={subtitle}
        icon={<BicolorAroundMe />}
        type={StepButtonState.COMPLETED}
      />
    )

    expect(screen.queryByText(subtitle)).not.toBeOnTheScreen()
  })

  it('should not return the subtitle when type is StepButtonState.DISABLED', () => {
    render(
      <StepCard
        title={title}
        subtitle={subtitle}
        icon={<BicolorAroundMe />}
        type={StepButtonState.DISABLED}
      />
    )

    expect(screen.queryByText(subtitle)).not.toBeOnTheScreen()
  })
})
