import React from 'react'

import { fireEvent, render } from 'tests/utils/web'

import { SeeMore } from './SeeMore'

const props = { height: 100, width: 100, onPress: jest.fn() }

describe('<SeeMore />', () => {
  it('renders correctly', () => {
    const seeMore = render(<SeeMore {...props} />)
    expect(seeMore).toMatchSnapshot()
  })
  it('calls onPress when clicking the arrow', () => {
    const seeMore = render(<SeeMore {...props} />)
    fireEvent.click(seeMore.getByTestId('arrow-next'))
    expect(props.onPress).toHaveBeenCalledTimes(1)
  })
  it('calls onPress when clicking the text', () => {
    const seeMore = render(<SeeMore {...props} />)
    fireEvent.click(seeMore.getByText('En voir plus'))
    expect(props.onPress).toHaveBeenCalledTimes(1)
  })
})
