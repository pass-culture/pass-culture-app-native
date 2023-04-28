import React from 'react'

import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'

import { StepCard, StepCardType } from './StepCard'

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

  it('should return the wrapper greyMedium when type is StepCardType.DISABLED', () => {
    const title = 'This is a StepCard'

    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepCardType.DISABLED} />)

    expect(screen.getByTestId('stepcard-container')).toHaveStyle({
      borderColor: theme.colors.greyMedium,
    })
  })

  it('should return the wrapper greyDark when type is StepCardType.DONE', () => {
    const title = 'This is a StepCard'

    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepCardType.DONE} />)

    expect(screen.getByTestId('stepcard-container')).toHaveStyle({
      borderColor: theme.colors.greyDark,
    })
  })

  it('should return the title greyDark when type is StepCardType.DISABLED', () => {
    const title = 'This is a StepCard'

    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepCardType.DISABLED} />)

    expect(screen.getByText(title)).toHaveStyle({
      color: theme.colors.greyDark,
    })
  })

  it('should return the title black when type is StepCardType.ACTIVE', () => {
    const title = 'This is a StepCard'

    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepCardType.ACTIVE} />)

    expect(screen.getByText(title)).toHaveStyle({
      color: theme.colors.black,
    })
  })

  it('should return the title greyDark when type is StepCardType.DONE', () => {
    const title = 'This is a StepCard'

    render(<StepCard title={title} icon={<BicolorAroundMe />} type={StepCardType.DONE} />)

    expect(screen.getByText(title)).toHaveStyle({
      color: theme.colors.greyDark,
    })
  })

  it('should return the subtitle greyDark when type is StepCardType.ACTIVE', () => {
    const title = 'This is a StepCard'
    const subtitle = 'This is a subtitle'

    render(
      <StepCard
        title={title}
        subtitle={subtitle}
        icon={<BicolorAroundMe />}
        type={StepCardType.ACTIVE}
      />
    )

    expect(screen.getByText(subtitle)).toHaveStyle({
      color: theme.colors.greyDark,
    })
  })

  it('should return the subtitle greySemiDark when type is StepCardType.DONE', () => {
    const title = 'This is a StepCard'
    const subtitle = 'This is a subtitle'

    render(
      <StepCard
        title={title}
        subtitle={subtitle}
        icon={<BicolorAroundMe />}
        type={StepCardType.DONE}
      />
    )

    expect(screen.getByText(subtitle)).toHaveStyle({
      color: theme.colors.greySemiDark,
    })
  })

  it('should return the subtitle greySemiDark when type is StepCardType.DISABLED', () => {
    const title = 'This is a StepCard'
    const subtitle = 'This is a subtitle'

    render(
      <StepCard
        title={title}
        subtitle={subtitle}
        icon={<BicolorAroundMe />}
        type={StepCardType.DISABLED}
      />
    )

    expect(screen.getByText(subtitle)).toHaveStyle({
      color: theme.colors.greySemiDark,
    })
  })
})
