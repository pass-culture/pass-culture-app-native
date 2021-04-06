import React from 'react'

import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { DotComponent, getColor } from './DotComponent'

describe('<DotComponent />', () => {
  const onPress = jest.fn()
  beforeEach(jest.clearAllMocks)

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
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('renders trigger onPress when pressed', () => {
    const { getByTestId } = renderDotComponent({
      activeIndex: 1,
      index: 1,
      isActive: true,
      onPress,
    })
    fireEvent.press(getByTestId('button'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should get grey medium color when after active index', () => {
    const color = getColor(2, 1)
    expect(color).toBe(ColorsEnum.GREY_MEDIUM)
  })

  it('should get primary color when active index', () => {
    const color = getColor(2, 2)
    expect(color).toBe(ColorsEnum.PRIMARY)
  })

  it('should get green valid color when before active index', () => {
    const color = getColor(1, 2)
    expect(color).toBe(ColorsEnum.GREEN_VALID)
  })
})

function renderDotComponent(
  props = {
    activeIndex: 0,
    index: 1,
    isActive: false,
    onPress: jest.fn(),
  }
) {
  return render(<DotComponent {...props} />)
}
