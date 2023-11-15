import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { HoursSlider } from 'features/search/components/HoursSlider/HoursSlider'
import { act, render, screen } from 'tests/utils'

describe('<HoursSlider />', () => {
  const onChangeMock = jest.fn()

  it('should render correctly', () => {
    render(<HoursSlider field={{ value: [8, 22] }} />)

    expect(screen.getByText(`8\u00a0h et 22\u00a0h`)).toBeOnTheScreen()
  })

  it('should update time range', async () => {
    render(<HoursSlider field={{ value: [8, 22], onChange: onChangeMock }} />)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange([18, 23])
    })

    expect(onChangeMock).toHaveBeenCalledWith([18, 23])
  })

  it('should call onChange with correct value', async () => {
    render(<HoursSlider field={{ value: [8, 22], onChange: onChangeMock }} />)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChangeFinish([18, 23])
    })

    expect(onChangeMock).toHaveBeenNthCalledWith(1, [18, 23])
  })
})
