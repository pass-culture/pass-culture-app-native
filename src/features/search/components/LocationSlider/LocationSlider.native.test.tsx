import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { LocationSlider } from 'features/search/components/LocationSlider/LocationSlider'
import { act, render, screen } from 'tests/utils'

describe('<LocationSlider />', () => {
  it('should render correctly', () => {
    render(<LocationSlider defaultValue={80} onChange={jest.fn()} />)

    expect(screen.getByText(`80\u00a0km`)).toBeOnTheScreen()
  })

  it('should update time range', async () => {
    render(<LocationSlider defaultValue={100} onChange={jest.fn()} />)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange(50)
    })

    expect(screen.getByText(`50\u00a0km`)).toBeOnTheScreen()
  })

  it('should call onChange with correct value', async () => {
    const onChange = jest.fn()

    render(<LocationSlider defaultValue={80} onChange={onChange} />)

    expect(screen.getByText(`80\u00a0km`)).toBeOnTheScreen()

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChangeFinish(50)
    })

    expect(onChange).toHaveBeenNthCalledWith(1, 50)
  })
})
