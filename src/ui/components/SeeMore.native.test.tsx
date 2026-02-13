import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { SeeMore } from './SeeMore'

const props = { height: 100, width: 100, onPress: jest.fn() }

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SeeMore />', () => {
  it('calls onPress when clicking the arrow', async () => {
    render(<SeeMore {...props} />)
    await user.press(screen.getByLabelText('En voir plus'))

    expect(props.onPress).toHaveBeenCalledTimes(1)
  })

  it('calls onPress when clicking the text', async () => {
    render(<SeeMore {...props} />)
    await user.press(screen.getByText('En voir plus'))

    expect(props.onPress).toHaveBeenCalledTimes(1)
  })
})
