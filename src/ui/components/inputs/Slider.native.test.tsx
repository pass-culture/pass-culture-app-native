import React from 'react'

import { render } from 'tests/utils'

import { Slider } from './Slider'

describe('<Slider />', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <Slider
        values={[0, 100]}
        showValues
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
      const { queryByText } = render(<Slider values={[0, 100]} showValues />)
      expect(queryByText('0 - 100')).toBeOnTheScreen()
    })

    it('should show one value if there are 1 value in the array values', () => {
      const { queryByText } = render(<Slider values={[100]} showValues />)
      expect(queryByText('100')).toBeOnTheScreen()
      expect(queryByText('0 - 100')).not.toBeOnTheScreen()
    })

    it('should not show values if showValues is false', () => {
      const { queryByText } = render(<Slider values={[100]} showValues={false} />)
      expect(queryByText('100')).not.toBeOnTheScreen()
      expect(queryByText('0 - 100')).not.toBeOnTheScreen()
    })

    it('should show minimum value if shouldShowMinMaxValues is true', () => {
      const { queryByText } = render(
        <Slider values={[100]} shouldShowMinMaxValues min={0} showValues={false} />
      )
      expect(queryByText('0')).toBeOnTheScreen()
    })

    it('should show maximim value if shouldShowMinMaxValues is true', () => {
      const { queryByText } = render(
        <Slider values={[100]} shouldShowMinMaxValues max={100} showValues={false} />
      )
      expect(queryByText('100')).toBeOnTheScreen()
    })

    it('should show minimum and maximum complement when defined', () => {
      const { queryByText } = render(
        <Slider
          values={[100]}
          shouldShowMinMaxValues
          max={100}
          showValues={false}
          minMaxValuesComplement={`\u00a0km`}
        />
      )
      expect(queryByText('100\u00a0km')).toBeOnTheScreen()
    })
  })
})
