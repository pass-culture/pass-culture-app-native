import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { LocationSlider } from 'features/search/components/LocationSlider/LocationSlider'
import { act, render, screen } from 'tests/utils'

describe('<LocationSlider />', () => {
  const onChangeMock = jest.fn()

  it('should render correctly', () => {
    render(<LocationSlider field={{ value: [80], onChange: jest.fn() }} />)

    expect(screen.getByText(`80\u00a0km`)).toBeOnTheScreen()
  })

  it('should update time range', async () => {
    render(<LocationSlider field={{ value: [100], onChange: onChangeMock }} />)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange([50])
    })

    expect(onChangeMock).toHaveBeenCalledWith([50])
  })

  it('should call onChange with correct value', async () => {
    render(<LocationSlider field={{ value: [80], onChange: onChangeMock }} />)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChangeFinish([50])
    })

    expect(onChangeMock).toHaveBeenNthCalledWith(1, [50])
  })
})
