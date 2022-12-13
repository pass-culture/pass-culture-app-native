import React from 'react'

import { render } from 'tests/utils'
import { theme } from 'theme'

import { DotComponent, getDotColors } from './DotComponent'

describe('<DotComponent />', () => {
  const onPress = jest.fn()

  it('should render correctly', () => {
    const renderAPI = renderDotComponent()
    expect(renderAPI).toMatchSnapshot()
  })

  it('renders dot active color', () => {
    const renderAPI = renderDotComponent({
      activeIndex: 1,
      index: 1,
      isActive: true,
      onPress,
      numberOfSteps: 1,
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('should get grey medium color when after active index', () => {
    const { borderColor, fillColor } = getDotColors(theme, 2, 1)
    expect(borderColor).toBe(theme.colors.greyDark)
    expect(fillColor).toBe(theme.colors.transparent)
  })

  it('should get primary color when active index', () => {
    const { borderColor, fillColor } = getDotColors(theme, 2, 2)
    expect(borderColor).toBe(theme.colors.primary)
    expect(fillColor).toBe(theme.colors.primary)
  })

  it('should get green valid color when before active index', () => {
    const { borderColor, fillColor } = getDotColors(theme, 1, 2)
    expect(borderColor).toBe(theme.colors.greenValid)
    expect(fillColor).toBe(theme.colors.greenValid)
  })

  it('should get neutral color when before active index if withNeutralPreviousStepsColor is true', () => {
    const withNeutralPreviousStepsColor = true
    const { borderColor, fillColor } = getDotColors(theme, 1, 2, withNeutralPreviousStepsColor)
    expect(borderColor).toBe(theme.colors.greyDark)
    expect(fillColor).toBe(theme.colors.transparent)
  })
})

function renderDotComponent(
  props = {
    activeIndex: 0,
    index: 1,
    isActive: false,
    onPress: jest.fn(),
    numberOfSteps: 1,
  }
) {
  return render(<DotComponent {...props} />)
}
