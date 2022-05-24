import React from 'react'

import { render } from 'tests/utils'

import { Slider } from './Slider'

describe('<Slider />', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <Slider
        values={[0, 100]}
        showValues={true}
        sliderLength={150}
        min={0}
        max={100}
        step={5}
        minLabel="Min label"
        maxLabel="Max label"
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  describe('values', () => {
    it('should show two values if there are 2 values in the array values', () => {
      const { queryByText } = render(<Slider values={[0, 100]} showValues={true} />)
      expect(queryByText('0 - 100')).toBeTruthy()
    })

    it('should show one value if there are 1 value in the array values', () => {
      const { queryByText } = render(<Slider values={[100]} showValues={true} />)
      expect(queryByText('100')).toBeTruthy()
      expect(queryByText('0 - 100')).toBeFalsy()
    })

    it('should not show values if showValues is false', () => {
      const { queryByText } = render(<Slider values={[100]} showValues={false} />)
      expect(queryByText('100')).toBeFalsy()
      expect(queryByText('0 - 100')).toBeFalsy()
    })
  })
})
