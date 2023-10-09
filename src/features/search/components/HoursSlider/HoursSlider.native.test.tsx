import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { HoursSlider } from 'features/search/components/HoursSlider/HoursSlider'
import { act, render, screen } from 'tests/utils'

describe('<HoursSlider />', () => {
  it('should render correctly', () => {
    render(<HoursSlider defaultValue={[8, 22]} onChange={jest.fn()} />)
    expect(screen.getByText(`8\u00a0h et 22\u00a0h`)).toBeOnTheScreen()
  })

  it('should update time range', async () => {
    render(<HoursSlider defaultValue={[8, 22]} onChange={jest.fn()} />)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange([18, 23])
    })

    expect(screen.getByText(`18\u00a0h et 23\u00a0h`)).toBeOnTheScreen()
  })

  it('should call onChange with correct value', async () => {
    const onChange = jest.fn()

    render(<HoursSlider defaultValue={[0, 24]} onChange={onChange} />)

    expect(screen.getByText(`0\u00a0h et 24\u00a0h`)).toBeOnTheScreen()

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChangeFinish([18, 23])
    })

    expect(onChange).toHaveBeenNthCalledWith(1, [18, 23])
  })
})
