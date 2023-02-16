import React from 'react'

import { fireEvent, render, screen } from 'tests/utils/web'

import { RadioSelector } from './RadioSelector'

describe('<RadioSelector />', () => {
  it('should call press when pressing Spacebar', () => {
    const onPress = jest.fn()
    render(<RadioSelector label="label" onPress={onPress} />)

    const Press = screen.getByTestId('label')
    fireEvent.focus(Press)
    fireEvent.keyDown(Press, { key: 'Spacebar' })

    expect(onPress).toBeCalledTimes(1)
  })
})
