import React from 'react'

import { fireEvent, render } from 'tests/utils'
import { theme } from 'theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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

  it('renders trigger onPress when pressed', () => {
    const { getByTestId } = renderDotComponent({
      activeIndex: 1,
      index: 1,
      isActive: true,
      onPress,
      numberOfSteps: 1,
    })
    fireEvent.press(getByTestId('button'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should get grey medium color when after active index', () => {
    const { borderColor, fillColor } = getDotColors(theme, 2, 1)
    expect(borderColor).toBe(ColorsEnum.GREY_DARK)
    expect(fillColor).toBe(ColorsEnum.TRANSPARENT)
  })

  it('should get primary color when active index', () => {
    const { borderColor, fillColor } = getDotColors(theme, 2, 2)
    expect(borderColor).toBe(ColorsEnum.PRIMARY)
    expect(fillColor).toBe(ColorsEnum.PRIMARY)
  })

  it('should get green valid color when before active index', () => {
    const { borderColor, fillColor } = getDotColors(theme, 1, 2)
    expect(borderColor).toBe(ColorsEnum.GREEN_VALID)
    expect(fillColor).toBe(ColorsEnum.GREEN_VALID)
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
