import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { SeeMore } from './SeeMore'

const props = { height: 100, width: 100, onPress: jest.fn() }

describe('<SeeMore />', () => {
  it('renders correctly', () => {
    render(<SeeMore {...props} />)

    expect(screen).toMatchSnapshot()
  })

  it('calls onPress when clicking the arrow', () => {
    render(<SeeMore {...props} />)
    fireEvent.press(screen.getByTestId('En voir plus'))

    expect(props.onPress).toHaveBeenCalledTimes(1)
  })

  it('calls onPress when clicking the text', () => {
    render(<SeeMore {...props} />)
    fireEvent.press(screen.getByText('En voir plus'))

    expect(props.onPress).toHaveBeenCalledTimes(1)
  })

  it('is a link when navigateTo is given', () => {
    render(<SeeMore {...props} navigateTo={{ screen: 'Accessibility' }} />)

    expect(screen.getByRole('link')).toBeOnTheScreen()
  })
})
