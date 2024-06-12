import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { act, render, screen } from 'tests/utils'

import { Slider } from './Slider'

describe('<Slider />', () => {
  describe('values', () => {
    it('should show two values if there are 2 values in the array values', () => {
      render(<Slider values={[0, 100]} showValues />)

      expect(screen.getByText('0 - 100')).toBeOnTheScreen()
    })

    it('should show one value if there are 1 value in the array values', () => {
      render(<Slider values={[100]} showValues />)

      expect(screen.getByText('100')).toBeOnTheScreen()
      expect(screen.queryByText('0 - 100')).not.toBeOnTheScreen()
    })

    it('should not show values if showValues is false', () => {
      render(<Slider values={[100]} showValues={false} />)

      expect(screen.queryByText('100')).not.toBeOnTheScreen()
      expect(screen.queryByText('0 - 100')).not.toBeOnTheScreen()
    })

    it('should show minimum value if shouldShowMinMaxValues is true', () => {
      render(<Slider values={[100]} shouldShowMinMaxValues min={0} showValues={false} />)

      expect(screen.getByText('0')).toBeOnTheScreen()
    })

    it('should show maximim value if shouldShowMinMaxValues is true', () => {
      render(<Slider values={[100]} shouldShowMinMaxValues max={100} showValues={false} />)

      expect(screen.getByText('100')).toBeOnTheScreen()
    })

    it('should show minimum and maximum complement when defined', () => {
      render(
        <Slider
          values={[100]}
          shouldShowMinMaxValues
          max={100}
          showValues={false}
          minMaxValuesComplement={`\u00a0km`}
        />
      )

      expect(screen.getByText('100\u00a0km')).toBeOnTheScreen()
    })

    it('should call onValuesChange when slider value changes', async () => {
      const mockOnValuesChange = jest.fn()

      render(<Slider values={[0, 100]} onValuesChange={mockOnValuesChange} showValues />)

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([50])
      })

      expect(mockOnValuesChange).toHaveBeenCalledWith([50])
    })
  })
})
